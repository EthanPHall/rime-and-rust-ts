import Directions, { DirectionsUtility } from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";
import CombatMapData from "./CombatMapData";

abstract class CombatAction{
    name: string;
    directional: boolean;
    ownerId: number;
    direction: Directions;
    updateEntity: (id:number, newEntity: CombatEntity) => void;

    constructor(name: string, directional: boolean, ownerId: number, direction: Directions = Directions.NONE, updateEntity: (id:number, newEntity: CombatEntity) => void){    
      this.name = name;
      this.directional = directional;
      this.ownerId = ownerId;
      this.direction = direction;
      this.updateEntity = updateEntity;
    }
  
    //MIGHTDO: Might want to put stuff like this into a factory class
    static clone(action:CombatAction) : CombatAction{
      if(action instanceof Attack){
        return Attack.clone(action);
      }
      if(action instanceof Block){
        return Block.clone(action);
      }
      if(action instanceof Move){
        return Move.clone(action);
      }

      throw new Error('Action type not recognized');
    }
  
    dataToObject() : Object{
      return {
        name: this.name,
        directional: this.directional,
        direction: this.direction
      };
    }

    abstract execute(): void;

    areEquivalent(action: CombatAction): boolean {
      return this.name === action.name && this.direction === action.direction;
    }

    areSameType(action: CombatAction): boolean {
      return this.name === action.name;
    }
  }

  class CombatActionWithUses {
    action: CombatAction;
    uses: number;
    maxUses: number;
  
    constructor(action: CombatAction, maxUses: number) {
      this.action = action;
      this.maxUses = maxUses;
      this.uses = maxUses;
    }
  }

  class CombatActionWithRepeat {
    combatAction: CombatAction;
    repeat: number;
  
    constructor(combatAction: CombatAction) {
      this.combatAction = combatAction;
      this.repeat = 1;
    }
    incrementRepeat(): void{
      this.repeat++;
    }
    decrementRepeat(): void{
      this.repeat--;
    }
    areEquivalent(action: CombatActionWithRepeat): boolean {
      return this.combatAction.areEquivalent(action.combatAction);
    }
  }  
  
  class Attack extends CombatAction {
    getMap: () => CombatMapData;

    constructor(ownerId: number, direction: Directions = Directions.NONE, getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void){
      super('Attack', true, ownerId, direction, updateEntity);
      this.getMap = getMap;
    }
  
    static clone(action: Attack) : Attack{
      return new Attack(action.ownerId, action.direction, action.getMap, action.updateEntity);
    }

    execute() {
      const map: CombatMapData = this.getMap();
      console.log(`Attacking ${this.direction}`);
      console.log(map);
    }
  }
  class Block extends CombatAction {
    constructor(ownerId: number, updateEntity: (id:number, newEntity: CombatEntity) => void){
      super('Block', false, ownerId, Directions.NONE, updateEntity);
    }

    static clone(action: Block) : Block{
      return new Block(action.ownerId, action.updateEntity);
    }
  
    execute() {
      console.log('Blocking');
    }
  }

  class Move extends  CombatAction {
    getMap: () => CombatMapData;

    constructor(ownerId: number, direction: Directions = Directions.NONE, getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void){
      super('Move', true, ownerId, direction, updateEntity);
      this.getMap = getMap;
    }

    static clone(action: Move) : Move{
      return new Move(action.ownerId, action.direction, action.getMap, action.updateEntity);
    }
  
    execute() {
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);

      const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
      const targetLocationData = map.locations[targetPosition.y][targetPosition.x];
      if(targetLocationData.entity || targetLocationData.solid){
        return;
      }
      else{
        const updatedEntity = owner.clone();
        updatedEntity.position = targetPosition;
        this.updateEntity(owner.id, updatedEntity);
      }
    }
  }
  
export default CombatAction;
export { Attack, Block, Move, CombatActionWithRepeat, CombatActionWithUses};
