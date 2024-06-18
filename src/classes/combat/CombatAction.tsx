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

    abstract clone(newDirection?:Directions): CombatAction;
  
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

    clone(newDirection:Directions = Directions.NONE) : Attack{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Attack(this.ownerId, direction, this.damage, this.getMap, this.updateEntity, this.refreshMap);
    }

    getTargetId(): number|undefined{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity|null = map.getEntityById(this.ownerId);

      if(!owner){return undefined;}

      const directionVector: Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const targetPosition: Vector2 = Vector2.add(owner.position, directionVector);
      const targetId:number|undefined = map.locations?.[targetPosition.y]?.[targetPosition.x]?.entity?.id
      
      if(targetId === undefined || targetId === owner.id) {return undefined;}
      else {return targetId;}
    }

    execute() {
      const targetId:number|undefined = this.getTargetId();
      const map: CombatMapData = this.getMap();
      
      if(targetId){
        const targetEntity = map.getEntityById(targetId)?.clone();

        if(!targetEntity){
          this.refreshMap();
          return;
        }

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





  class AttackForHazards extends CombatAction {
    getMap: () => CombatMapData;
    damage: number;
    ownerEntity: CombatEntity;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      damage: number,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void,
      ownerEntity: CombatEntity
    ){
      super('Attack', true, ownerId, direction, updateEntity, refreshMap);
      this.getMap = getMap;
      this.damage = damage;
      this.ownerEntity = ownerEntity;
    }
  
    clone() : AttackForHazards{
      return new AttackForHazards(this.ownerId, this.direction, this.damage, this.getMap, this.updateEntity, this.refreshMap, this.ownerEntity);
    }

    getTargetId(): number|undefined{
      const map: CombatMapData = this.getMap();
      const directionVector: Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const targetPosition: Vector2 = Vector2.add(this.ownerEntity.position, directionVector);
      const targetId:number|undefined = map.locations?.[targetPosition.y]?.[targetPosition.x]?.entity?.id
      
      if(targetId === undefined || targetId === this.ownerEntity.id) {return undefined;}
      else {return targetId;}
    }

    execute() {
      const targetId:number|undefined = this.getTargetId();
      const map: CombatMapData = this.getMap();
      
      if(targetId){
        const targetEntity = map.getEntityById(targetId)?.clone();

        if(!targetEntity){
          this.refreshMap();
          return;
        }

        targetEntity.hp -= this.damage;
        this.updateEntity(targetEntity.id, targetEntity);
        return;
      }

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const targetId:number|undefined = this.getTargetId();

      const result:AnimationDetails[][] = [[]];
      if(targetId) result[0] = [CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, targetId)];

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

    clone(newDirection:Directions|undefined) : Move{
      const direction: Directions = newDirection ? newDirection : this.direction;
      
      return new Move(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
    }
  
    execute() {
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity|null = map.getEntityById(this.ownerId);

      if(owner){
        const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
        const targetLocationData = map.locations?.[targetPosition.y]?.[targetPosition.x];
        
        const updatedEntity = owner.clone();
        let isWalkable:boolean = false;
        if(targetLocationData){
          isWalkable = targetLocationData.entity ? targetLocationData.entity.isWalkable() : true;
        }
        
        if(!targetLocationData || !isWalkable){
          this.refreshMap();
        }
        else{
          updatedEntity.position = targetPosition;
          this.updateEntity(owner.id, updatedEntity);
        }
      }
      else{
        this.refreshMap();
        return;
      }
    }

    getAnimations(): AnimationDetails[][] {
      const animationsToSendOff: AnimationDetails[][] = [[]];

      const map: CombatMapData = this.getMap();
      const owner: CombatEntity|null = map.getEntityById(this.ownerId);

      if(owner){
        const targetPosition = Vector2.add(owner.position, DirectionsUtility.getVectorFromDirection(this.direction));
        const targetLocationData = map.locations?.[targetPosition.y]?.[targetPosition.x];
        let isWalkable:boolean = false;
        if(targetLocationData){
          isWalkable = targetLocationData.entity ? targetLocationData.entity.isWalkable() : true;
        }

        if(!targetLocationData || !isWalkable){
          animationsToSendOff[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Bump, this.direction, this.ownerId));
        }
        else{
          animationsToSendOff[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, this.direction, this.ownerId));
        }
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

    getTargets(): [number[], Vector2[]]{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity|null = map.getEntityById(this.ownerId);

      if(!owner){return [[], []];}

      const [entities, positions] = this.aoe.getAffectedEntities(owner.position.x, owner.position.y, map);
      const targetIds:number[] = entities.map((entity) => entity.id);
      return [targetIds, positions];
    }

    execute() {
      const [targetIds] = this.getTargets();
      const map: CombatMapData = this.getMap();
      const pullVector:Vector2 = DirectionsUtility.getVectorFromDirection(DirectionsUtility.getOppositeDirection(this.direction));
      
      //TODO: Refactor this into a method, and do the same in getAnimations
      let previousEntity:CombatEntity|null = null;
      let previousDidBump:boolean = false;
      const forwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const backwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(DirectionsUtility.getOppositeDirection(this.direction));
      for(let i = 0; i < targetIds.length; i++){
        const targetEntity:CombatEntity|undefined = map.getEntityById(targetIds[i])?.clone();
        if(!targetEntity){
          continue;
        }

        if(!targetEntity.isMovable()){
          continue;
        }

        let bumped:boolean = false;
        targetEntity.hp -= this.damage;

        const backwardPosition:Vector2 = Vector2.add(targetEntity.position, backwardsVector);
        if(previousEntity){
          const forwardPosition:Vector2 = Vector2.add(previousEntity.position, forwardsVector);
          const currentIsInFrontOfPrevious:boolean = Vector2.equals(targetEntity.position, forwardPosition);
          if(currentIsInFrontOfPrevious){
            bumped = previousDidBump;
          }
        }else if(
          map.locations[backwardPosition.y][backwardPosition.x].entity != null &&
          !map.locations[backwardPosition.y][backwardPosition.x].entity?.isWalkable()
        ){
          bumped = true;
        }

        if(bumped){
          targetEntity.hp -= this.damage;
        }
        else{
          targetEntity.position = Vector2.add(targetEntity.position, pullVector);
        }
        this.updateEntity(targetEntity.id, targetEntity);
        
        previousEntity = targetEntity;
        previousDidBump = bumped;
      }      

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const [targetIds, positions] = this.getTargets();
      const reverseDirection:Directions = DirectionsUtility.getOppositeDirection(this.direction);
      const map: CombatMapData = this.getMap();

      const result:AnimationDetails[][] = [[],[],[]];
      result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId));

      positions.forEach((position) => {
        result[1].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Psychic, this.direction, -1, false, position));
      });

      // targetIds.forEach((targetId) => {
      //   result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, reverseDirection, targetId));
      // });

      let previousEntity:CombatEntity|null = null;
      let previousDidBump:boolean = false;
      const forwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const backwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(DirectionsUtility.getOppositeDirection(this.direction));
      for(let i = 0; i < targetIds.length; i++){
        const targetEntity:CombatEntity|undefined = map.getEntityById(targetIds[i])?.clone();
        if(!targetEntity){
          continue;
        }

        if(!targetEntity.isMovable()){
          continue;
        }

        let bumped:boolean = false;

        const backwardPosition:Vector2 = Vector2.add(targetEntity.position, backwardsVector);
        if(previousEntity){
          const forwardPosition:Vector2 = Vector2.add(previousEntity.position, forwardsVector);
          const currentIsInFrontOfPrevious:boolean = Vector2.equals(targetEntity.position, forwardPosition);
          if(currentIsInFrontOfPrevious){
            bumped = previousDidBump;
          }
        }else if(
          map.locations[backwardPosition.y][backwardPosition.x].entity != null &&
          !map.locations[backwardPosition.y][backwardPosition.x].entity?.isWalkable()
        ){
          bumped = true;
        }

        if(bumped){
          result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.ShortBump, reverseDirection, targetIds[i]));
        }
        else{
          result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, reverseDirection, targetIds[i]));
        }
        this.updateEntity(targetEntity.id, targetEntity);
        
        previousEntity = targetEntity;
        previousDidBump = bumped;
      }      


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

    getTargets(): [number[], Vector2[], CombatEntity[]]{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity|null = map.getEntityById(this.ownerId);

      if(!owner){return [[], [], []];}

      const [entities, positions] = this.aoe.getAffectedEntities(owner.position.x, owner.position.y, map);
      const targetIds:number[] = entities.map((entity) => entity.id);
      return [targetIds, positions, entities];
    }

    execute() {
      const [targetIds] = this.getTargets();
      const map: CombatMapData = this.getMap();
      const pushVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      
      // targetIds.forEach((targetId) => {
      //   const targetEntity = map.getEntityById(targetId).clone();
      //   targetEntity.hp -= this.damage;
      //   targetEntity.position = Vector2.add(targetEntity.position, pushVector);
      //   this.updateEntity(targetEntity.id, targetEntity);
      // });

      //TODO: Refactor this into a method, and do the same in getAnimations
      let previousEntity:CombatEntity|null = null;
      let previousDidBump:boolean = false;
      const forwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const backwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(DirectionsUtility.getOppositeDirection(this.direction));
      for(let i = targetIds.length-1; i >= 0; i--){
        const targetEntity:CombatEntity|undefined = map.getEntityById(targetIds[i])?.clone();
        if(!targetEntity){
          continue;
        }

        if(!targetEntity.isMovable()){
          continue;
        }
        
        let bumped:boolean = false;
        targetEntity.hp -= this.damage;

        const forwardPosition:Vector2 = Vector2.add(targetEntity.position, forwardsVector);
        if(previousEntity){
          const backwardPosition:Vector2 = Vector2.add(previousEntity.position, backwardsVector);
          const currentIsBehindPrevious:boolean = Vector2.equals(targetEntity.position, backwardPosition);
          if(currentIsBehindPrevious){
            bumped = previousDidBump;
          }
        }else if(
          map.locations[forwardPosition.y][forwardPosition.x].entity != null &&
          !map.locations[forwardPosition.y][forwardPosition.x].entity?.isWalkable()
        ){
          bumped = true;
        }

        if(bumped){
          targetEntity.hp -= this.damage;
        }
        else{
          targetEntity.position = Vector2.add(targetEntity.position, pushVector);
        }
        this.updateEntity(targetEntity.id, targetEntity);
        
        previousEntity = targetEntity;
        previousDidBump = bumped;
      }

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const [targetIds, positions, entities] = this.getTargets();
      const map: CombatMapData = this.getMap();

      const result:AnimationDetails[][] = [[],[],[]];
      result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId));

      positions.forEach((position) => {
        result[1].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Psychic, this.direction, -1, false, position));
      });

      let previousEntity:CombatEntity|null = null;
      let previousDidBump:boolean = false;
      const forwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const backwardsVector:Vector2 = DirectionsUtility.getVectorFromDirection(DirectionsUtility.getOppositeDirection(this.direction));
      for(let i = entities.length-1; i >= 0; i--){
        if(!entities[i].isMovable()){
          continue;
        }

        let bumped:boolean = false;

        const forwardPosition:Vector2 = Vector2.add(entities[i].position, forwardsVector);
        if(previousEntity){
          const backwardPosition:Vector2 = Vector2.add(previousEntity.position, backwardsVector);
          const currentIsBehindPrevious:boolean = Vector2.equals(entities[i].position, backwardPosition);
          if(currentIsBehindPrevious){
            bumped = previousDidBump;
          }
        }else if(
          map.locations[forwardPosition.y][forwardPosition.x].entity != null &&
          !map.locations[forwardPosition.y][forwardPosition.x].entity?.isWalkable()
        ){
          bumped = true;
        }

        if(bumped){
          result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.ShortBump, this.direction, entities[i].id));
        }
        else{
          result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, this.direction, entities[i].id));
        }
        
        previousEntity = entities[i];
        previousDidBump = bumped;
      }

      return result;
    }
  }
  
export default CombatAction;
export { Attack, Block, Move, CombatActionWithRepeat, CombatActionWithUses, PullRange5, PushRange5, AttackForHazards as AttackGivenOwnerEntity};
