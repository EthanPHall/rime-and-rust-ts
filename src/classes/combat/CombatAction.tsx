import AnimationDetails from "../animation/AnimationDetails";
import CombatAnimationFactory, { CombatAnimationNames } from "../animation/CombatAnimationFactory";
import Directions, { DirectionsUtility } from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import AreaOfEffect from "./AreaOfEffect";
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
    // static clone(action:CombatAction) : CombatAction{
    //   if(action instanceof Attack){
    //     return Attack.clone(action);
    //   }
    //   if(action instanceof Block){
    //     return Block.clone(action);
    //   }
    //   if(action instanceof Move){
    //     return Move.clone(action);
    //   }

    //   throw new Error('Action type not recognized');
    // }

    abstract clone(): CombatAction;
  
    dataToObject() : Object{
      return {
        name: this.name,
        directional: this.directional,
        direction: this.direction
      };
    }

    abstract execute(): void;
    abstract getAnimations(): AnimationDetails[][];

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
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      damage: number,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Attack', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
      this.damage = damage;
    }
  
    clone() : Attack{
      return new Attack(this.ownerId, this.direction, this.damage, this.getMap, this.updateEntity, this.refreshMap);
    }

    getTargetId(): number|undefined{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);
      const directionVector: Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const targetPosition: Vector2 = Vector2.add(owner.position, directionVector);
      return map.locations?.[targetPosition.y]?.[targetPosition.x].entity?.id;
    }

    execute() {
      const targetId:number|undefined = this.getTargetId();
      const map: CombatMapData = this.getMap();
      
      if(targetId){
        const targetEntity = map.getEntityById(targetId).clone();
        targetEntity.hp -= this.damage;
        this.updateEntity(targetEntity.id, targetEntity);
        return;
      }

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const targetId:number|undefined = this.getTargetId();

      const result:AnimationDetails[][] = [[CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId)]];
      if(targetId) result[1] = [CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, targetId)];

      return result;
    }
  }
  class Block extends CombatAction {
    constructor(ownerId: number, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){
      super('Block', false, ownerId, Directions.NONE, updateEntity, refreshMap);
    }

    clone() : Block{
      return new Block(this.ownerId, this.updateEntity, this.refreshMap);
    }

    execute() {
      console.log('Blocking');
      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      return [[CombatAnimationFactory.createAnimation(CombatAnimationNames.Block, Directions.NONE, this.ownerId)]];
    }
  }

  class Move extends  CombatAction {
    getMap: () => CombatMapData;

    constructor(ownerId: number, direction: Directions = Directions.NONE, getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){
      super('Move', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
    }

    clone() : Move{
      return new Move(this.ownerId, this.direction, this.getMap, this.updateEntity, this.refreshMap);
    }
  
    execute() {
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);

      const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
      const targetLocationData = map.locations?.[targetPosition.y]?.[targetPosition.x];
      
      const updatedEntity = owner.clone();
      if(!targetLocationData || targetLocationData.entity || targetLocationData.solid){
        this.refreshMap();
      }
      else{
        updatedEntity.position = targetPosition;
        this.updateEntity(owner.id, updatedEntity);
      }
    }

    getAnimations(): AnimationDetails[][] {
      const animationsToSendOff: AnimationDetails[][] = [[]];

      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);

      const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
      const targetLocationData = map.locations?.[targetPosition.y]?.[targetPosition.x];
      
      if(!targetLocationData || targetLocationData.entity || targetLocationData.solid){
        animationsToSendOff[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Bump, this.direction, this.ownerId));
      }
      else{
        animationsToSendOff[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, this.direction, this.ownerId));
      }

      return animationsToSendOff;
    }
  }

  class PullRange5 extends CombatAction {
    getMap: () => CombatMapData;
    damage: number;
    aoe: AreaOfEffect;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      damage: number,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Pull', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
      this.damage = damage;

      this.aoe = new AreaOfEffect(5, direction, 0, false);
    }
  
    clone(): CombatAction {
      return new PullRange5(this.ownerId, this.direction, this.damage, this.getMap, this.updateEntity, this.refreshMap);
    }

    getTargetIds(): number[]{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);
      const targetIds:number[] = this.aoe.getAffectedEntities(owner.position.x, owner.position.y, map).map((entity) => entity.id);
      return targetIds;
    }

    execute() {
      const targetIds:number[] = this.getTargetIds();
      const map: CombatMapData = this.getMap();
      const pullVector:Vector2 = DirectionsUtility.getVectorFromDirection(DirectionsUtility.getOppositeDirection(this.direction));
      
      targetIds.forEach((targetId) => {
        const targetEntity = map.getEntityById(targetId).clone();
        targetEntity.hp -= this.damage;
        targetEntity.position = Vector2.add(targetEntity.position, pullVector);
        this.updateEntity(targetEntity.id, targetEntity);
      });

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const targetIds:number[] = this.getTargetIds();

      const result:AnimationDetails[][] = [[],[]];
      result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId));

      targetIds.forEach((targetId) => {
        result[1].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, targetId));
      });

      return result;
    }
  }

  class PushRange5 extends CombatAction {
    getMap: () => CombatMapData;
    damage: number;
    aoe: AreaOfEffect;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      damage: number,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Push', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
      this.damage = damage;

      this.aoe = new AreaOfEffect(5, direction, 0, false);
    }
  
    clone(): CombatAction {
      return new PushRange5(this.ownerId, this.direction, this.damage, this.getMap, this.updateEntity, this.refreshMap);
    }

    getTargetIds(): number[]{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity = map.getEntityById(this.ownerId);
      const targetIds:number[] = this.aoe.getAffectedEntities(owner.position.x, owner.position.y, map).map((entity) => entity.id);
      return targetIds;
    }

    execute() {
      const targetIds:number[] = this.getTargetIds();
      const map: CombatMapData = this.getMap();
      const pushVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      
      targetIds.forEach((targetId) => {
        const targetEntity = map.getEntityById(targetId).clone();
        targetEntity.hp -= this.damage;
        targetEntity.position = Vector2.add(targetEntity.position, pushVector);
        this.updateEntity(targetEntity.id, targetEntity);
      });

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const targetIds:number[] = this.getTargetIds();

      const result:AnimationDetails[][] = [[],[]];
      result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId));

      targetIds.forEach((targetId) => {
        result[1].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, targetId));
      });

      return result;
    }
  }
  
export default CombatAction;
export { Attack, Block, Move, CombatActionWithRepeat, CombatActionWithUses, PullRange5, PushRange5};
