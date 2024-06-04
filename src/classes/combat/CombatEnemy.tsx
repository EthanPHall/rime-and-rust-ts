import Directions from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import CombatAction, {  CombatActionWithRepeat, Move } from "./CombatAction";
import CombatEntity from "./CombatEntity";
import CombatMapData from "./CombatMapData";
import IActionExecutor from "./IActionExecutor";
import TurnTaker from "./TurnTaker";

abstract class CombatEnemy extends CombatEntity implements TurnTaker{
  getMap: () => CombatMapData;
  updateEntity: (id:number, newEntity: CombatEntity) => void;
  refreshMap: () => void;  

  addActionToList: (action: CombatAction) => void;
  executeActionsList: () => void;
  
    combatEntity: CombatEntity = this;
    advanceTurn: () => void;
    startTurn(): void {
      setTimeout(() => {
        this.addActionToList(new Move(this.id, Directions.DOWN, this.getMap, this.updateEntity, this.refreshMap));
        this.addActionToList(new Move(this.id, Directions.DOWN, this.getMap, this.updateEntity, this.refreshMap));
      }, 1000);

      
      setTimeout(() => {
        // this.endTurn();
        this.executeActionsList();
      }, 2500);
    }
    endTurn(): void {
      console.log(`${this.name} is ending their turn.`);
      this.advanceTurn();
    }

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
    }

    clone(): CombatEnemy{
      return new RustedShambler(
        this.id, 
        this.position, 
        this.advanceTurn,
        this.addActionToList,
        this.executeActionsList,
        this.getMap,
        this.updateEntity,
        this.refreshMap
      );
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
    }
  }

export default CombatEnemy;
export { RustedShambler, RustedBrute };