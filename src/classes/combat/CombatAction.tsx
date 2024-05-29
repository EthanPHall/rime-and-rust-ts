import AnimationDetails from "../animation/AnimationDetails";
import CombatAnimationFactory, { CombatAnimationNames } from "../animation/CombatAnimationFactory";
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
    refreshMap: () => void;

    constructor(name: string, directional: boolean, ownerId: number, direction: Directions = Directions.NONE, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){    
      this.name = name;
      this.directional = directional;
      this.ownerId = ownerId;
      this.direction = direction;
      this.updateEntity = updateEntity;
      this.refreshMap = refreshMap;
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
    abstract getAnimations(): AnimationDetails[];

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

    constructor(ownerId: number, direction: Directions = Directions.NONE, getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){
      super('Attack', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
    }
  
    static clone(action: Attack) : Attack{
      return new Attack(action.ownerId, action.direction, action.getMap, action.updateEntity, action.refreshMap);
    }

    execute() {
      const map: CombatMapData = this.getMap();
      console.log(`Attacking ${this.direction}`);
      console.log(map);
    }

    getAnimations(): AnimationDetails[] {
      return [CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId)];
    }
  }
  class Block extends CombatAction {
    constructor(ownerId: number, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){
      super('Block', false, ownerId, Directions.NONE, updateEntity, refreshMap);
    }

    static clone(action: Block) : Block{
      return new Block(action.ownerId, action.updateEntity, action.refreshMap);
    }
  
    execute() {
      console.log('Blocking');
    }

    getAnimations(): AnimationDetails[] {
      return [CombatAnimationFactory.createAnimation(CombatAnimationNames.Block, Directions.NONE, this.ownerId)];
    }
  }

  class Move extends  CombatAction {
    getMap: () => CombatMapData;

    constructor(ownerId: number, direction: Directions = Directions.NONE, getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){
      super('Move', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
    }

    static clone(action: Move) : Move{
      return new Move(action.ownerId, action.direction, action.getMap, action.updateEntity, action.refreshMap);
    }
  
    execute() {
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);

      const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
      const targetLocationData = map.locations[targetPosition.y][targetPosition.x];
      
      const updatedEntity = owner.clone();
      if(targetLocationData.entity || targetLocationData.solid){
        this.refreshMap();
      }
      else{
        updatedEntity.position = targetPosition;
        this.updateEntity(owner.id, updatedEntity);
      }
    }

    getAnimations(): AnimationDetails[] {
      const animationsToSendOff: AnimationDetails[] = [];

      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);

      const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
      const targetLocationData = map.locations[targetPosition.y][targetPosition.x];
      if(targetLocationData.entity || targetLocationData.solid){
        animationsToSendOff.push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Bump, this.direction, this.ownerId));
      }
      else{
        animationsToSendOff.push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, this.direction, this.ownerId));
      }

      return animationsToSendOff;
    }
  }
  
export default CombatAction;
export { Attack, Block, Move, CombatActionWithRepeat, CombatActionWithUses};
