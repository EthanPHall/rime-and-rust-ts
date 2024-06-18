import PathfindingUtil from "../ai/PathfindingUtil";
import Directions, { DirectionsUtility } from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import CombatAction, {  Attack, CombatActionWithRepeat, CombatActionWithUses, Move } from "./CombatAction";
import CombatEntity from "./CombatEntity";
import CombatMapData from "./CombatMapData";
import IActionExecutor from "./IActionExecutor";
import TurnTaker from "./TurnTaker";

abstract class CombatEnemy extends CombatEntity implements TurnTaker{
  static ACTION_DELAY = 350;
  static TURN_START_DELAY = 1000;

  getMap: () => CombatMapData;
  updateEntity: (id:number, newEntity: CombatEntity) => void;
  refreshMap: () => void;  

  addActionToList: (action: CombatAction) => void;
  executeActionsList: () => void;
  canTakeTurn(): boolean {
      return this.hp > 0;
  }
  
    combatEntity: CombatEntity = this;
    advanceTurn: () => void;
    startTurn(): void {
      this.executeTurn();
    }
    endTurn(): void {
      console.log(`${this.name} is ending their turn.`);
      this.advanceTurn();
    }

    abstract executeTurn(): Promise<void>;

    setHp(hp: number): void{
      this.hp = hp;
    }

    actions: { [ k: string ]: CombatActionWithUses };
    playerId: number;

    constructor(
      id:number, 
      hp: number, 
      maxHp: number, 
      symbol: string, 
      name: string, 
      position: Vector2, 
      advanceTurn: () => void,
      addActionToList: (action: CombatAction) => void,
      executeActionsList: () => void,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super(id, hp, maxHp, symbol, name, position);
      this.advanceTurn = advanceTurn;
      this.addActionToList = addActionToList;
      this.executeActionsList = executeActionsList;
      this.getMap = getMap;
      this.updateEntity = updateEntity;
      this.refreshMap = refreshMap;
      this.actions = {};
      this.playerId = getMap().getPlayer()?.id || -1;
    }

    clone(): CombatEnemy {
      const clone = new RustedShambler(
        this.id, 
        this.position, 
        this.advanceTurn,
        this.addActionToList,
        this.executeActionsList,
        this.getMap,
        this.updateEntity,
        this.refreshMap
      );

      clone.setHp(this.hp);

      return clone;
    }
  }
  
  class RustedShambler extends CombatEnemy{
    constructor(
      id: number, 
      position: Vector2, 
      advanceTurn: () => void,
      addActionToList: (action: CombatAction) => void,
      executeActionsList: () => void,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super(
        id, 
        10, 
        10, 
        'S', 
        'Rusted Shambler', 
        position, 
        advanceTurn, 
        addActionToList, 
        executeActionsList,
        getMap,
        updateEntity,
        refreshMap
      );
    }

    clone(): RustedShambler {
      const clone = new RustedShambler(
        this.id, 
        this.position, 
        this.advanceTurn,
        this.addActionToList,
        this.executeActionsList,
        this.getMap,
        this.updateEntity,
        this.refreshMap
      );

      clone.setHp(this.hp);

      return clone;
    }

    async executeTurn(): Promise<void> {
      setTimeout(() => {
        this.addActionToList(new Attack(this.id, Directions.LEFT, 5, this.getMap, this.updateEntity, this.refreshMap));
        this.addActionToList(new Attack(this.id, Directions.LEFT, 5, this.getMap, this.updateEntity, this.refreshMap));
        this.addActionToList(new Move(this.id, Directions.DOWN, this.getMap, this.updateEntity, this.refreshMap));
        this.addActionToList(new Move(this.id, Directions.DOWN, this.getMap, this.updateEntity, this.refreshMap));
      }, 1000);

      
      setTimeout(() => {
        // this.endTurn();
        this.executeActionsList();
      }, 1500);
    }
  }
  
  class RustedBrute extends CombatEnemy{


    constructor(
      id: number,
      position: Vector2, 
      advanceTurn: () => void,
      addActionToList: (action: CombatAction) => void,
      executeActionsList: () => void,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super(
        id, 
        20, 
        20, 
        'B', 
        'Rusted Brute', 
        position, 
        advanceTurn, 
        addActionToList, 
        executeActionsList,
        getMap,
        updateEntity,
        refreshMap
      );

      this.actions = {
        attack: new CombatActionWithUses(new Attack(this.id, undefined, 5, this.getMap, this.updateEntity, this.refreshMap), 2),
        move: new CombatActionWithUses(new Move(this.id, undefined, getMap, updateEntity, refreshMap), 5),
      };
    }

    clone(): RustedBrute {
      const clone = new RustedBrute(
        this.id, 
        this.position, 
        this.advanceTurn,
        this.addActionToList,
        this.executeActionsList,
        this.getMap,
        this.updateEntity,
        this.refreshMap
      );
  
      clone.setHp(this.hp);
  
      return clone;
    }

    async executeTurn(): Promise<void> {
      const playerPosition:Vector2|undefined = this.getMap().getEntityById(this.playerId)?.position;

      await new Promise((resolve) => setTimeout(resolve, CombatEnemy.TURN_START_DELAY));

      if(playerPosition){
        const directions = PathfindingUtil.findPath(this.position, playerPosition, this.getMap());

        //Handle movement actions.
        const loopLimit = Math.min(directions.length, this.actions.move.uses);
        for(let i = 0; i < loopLimit; i++){
          this.addActionToList(this.actions.move.action.clone(directions[i]));
          await new Promise((resolve) => setTimeout(resolve, CombatEnemy.ACTION_DELAY));
        }

        //Handle attack actions.
        const targetPosition = directions.length != 0 ? PathfindingUtil.findStoppingPoint(this.position, directions, this.actions.move.uses) : this.position;
        if(targetPosition){
          const neighbors:Vector2[] = DirectionsUtility.getNeighbors(targetPosition, this.getMap());
          let playerLocation:Vector2|null = null;
          
          console.log(this.id, targetPosition);
          for(let i = 0; i < this.actions.attack.uses; i++){
            //Don't go through the inner loop again if the player position was found.
            if(playerLocation){
              this.addActionToList(this.actions.attack.action.clone(DirectionsUtility.getDirectionFromCoordinates(targetPosition, playerLocation)));
              await new Promise((resolve) => setTimeout(resolve, CombatEnemy.ACTION_DELAY));
              break;
            }
            
            //Find the player's location, if they are in the neighbors
            for(const neighbor of neighbors){
              console.log(neighbor, this.getMap().locations[neighbor.y][neighbor.x].entity?.id, this.playerId);
              if(this.getMap().locations[neighbor.y][neighbor.x].entity?.id === this.playerId){
                playerLocation = neighbor;
                this.addActionToList(this.actions.attack.action.clone(DirectionsUtility.getDirectionFromCoordinates(targetPosition, playerLocation)));
                await new Promise((resolve) => setTimeout(resolve, CombatEnemy.ACTION_DELAY));
                break;
              }
            }  
          }
        }
      }
      
      console.log("---End of Turn---");

      setTimeout(() => {
        this.executeActionsList();
      }, CombatEnemy.ACTION_DELAY);
    }
  }

export default CombatEnemy;
export { RustedShambler, RustedBrute };