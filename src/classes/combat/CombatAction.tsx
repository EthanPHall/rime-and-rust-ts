import AnimationDetails from "../animation/AnimationDetails";
import CombatAnimationFactory, { CombatAnimationNames } from "../animation/CombatAnimationFactory";
import Directions, { DirectionsUtility } from "../utility/Directions";
import IdGenerator from "../utility/IdGenerator";
import Vector2 from "../utility/Vector2";
import AreaOfEffect from "./AreaOfEffect";
import CombatEnemy from "./CombatEnemy";
import CombatEntity from "./CombatEntity";
import CombatHazard, { BurningFloor, Wall, Fireball as FireballHazard } from "./CombatHazard";
import CombatHazardSymbolFactory from "./CombatHazardSymbolFactory";
import CombatMapData from "./CombatMapData";
import CombatPlayer from "./CombatPlayer";
import EntitySpawner from "./EntitySpawner";
import hazardsJSONData from "../../data/combat/hazards.json"
import { ISettingsManager } from "../../context/misc/SettingsContext";
import CombatHazardFireballFactory from "./CombatHazardFireballFactory";
import ReactionFlags from "./Reactions/ReactionFlags";
import ConditionGrappled, { GrappleModes } from "./Conditions/ConditionGrappled";
import ConditionName from "./Conditions/ConditionNames";
import ICondition from "./Conditions/ICondition";

abstract class CombatAction{
    name: string;
    directional: boolean;
    ownerId: number;
    direction: Directions;
    bypassUseLimits: boolean = false;
    updateEntity: (id:number, newEntity: CombatEntity) => void;
    refreshMap: () => void;
    getMap: () => CombatMapData;

    constructor(name: string, directional: boolean, ownerId: number, direction: Directions = Directions.NONE, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void, getMap: () => CombatMapData){    
      this.name = name;
      this.directional = directional;
      this.ownerId = ownerId;
      this.direction = direction;
      this.updateEntity = updateEntity;
      this.refreshMap = refreshMap;
      this.getMap = getMap;
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
    abstract getName(): string;
    abstract getCorrectAction(): CombatAction;

    getShouldBypassUseLimits(): boolean{
      return this.bypassUseLimits;
    }
    getIsDirectional(): boolean{
      return this.directional;
    }
  
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
     
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Attack', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 5;
    }

    clone(newDirection:Directions = Directions.NONE) : Attack{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Attack(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_ATTACKED, this, this.ownerId);
        }

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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }
  }


  class Chop extends CombatAction {
     
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Chop', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 3;
    }

    clone(newDirection:Directions = Directions.NONE) : Chop{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Chop(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_ATTACKED, this, this.ownerId);
        }

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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }
  }

  class Slice extends CombatAction {
     
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Slice', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 6;
    }

    clone(newDirection:Directions = Directions.NONE) : Slice{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Slice(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_ATTACKED, this, this.ownerId);
        }

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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }
  }

  class Lacerate extends CombatAction {
     
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Lacerate', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 12;
    }

    clone(newDirection:Directions = Directions.NONE) : Lacerate{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Lacerate(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_ATTACKED, this, this.ownerId);
        }

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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }


  class Punch extends CombatAction {
     
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Punch', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 1;
    }

    clone(newDirection:Directions = Directions.NONE) : Punch{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Punch(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_ATTACKED, this, this.ownerId);
        }

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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }

  class Grapple extends CombatAction {
     
    damage: number;
    switchGrappleMode: SwitchGrappleMode;
    getComboList: () => CombatActionWithRepeat[];

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      switchGrappleMode: SwitchGrappleMode,
      getComboList:() => CombatActionWithRepeat[],
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Grapple', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 1;
      this.switchGrappleMode = switchGrappleMode;
      this.getComboList = getComboList;
    }

    clone(newDirection:Directions = Directions.NONE) : Grapple{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Grapple(this.ownerId, direction, this.switchGrappleMode, this.getComboList, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.addCondition(new ConditionGrappled(targetId, this.ownerId));

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_GRAPPLED, this, this.ownerId);
        }

        this.updateEntity(targetEntity.id, targetEntity);
        return;
      }

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const targetId:number|undefined = this.getTargetId();

      const result:AnimationDetails[][] = [[CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId)]];
      if(targetId) result[1] = [CombatAnimationFactory.createAnimation(CombatAnimationNames.Grapple, this.direction, targetId)];

      return result;
    }

    getName(): string{
      var nameToUse:string = this.name;

      const map: CombatMapData = this.getMap();
      const grappledEntities:CombatEntity[] = map.getEntitiesWithCondition(ConditionName.Grappled);

      const grapplesAppliedByOwner:ICondition[] = [];
      
      grappledEntities
        .forEach(entity => {
          entity.getConditions()
            .filter(condition => { return condition.getName() == ConditionName.Grappled; })
            .filter(condition => { return condition.getApplyerId() == this.ownerId; })
            .forEach(condition => { grapplesAppliedByOwner.push(condition); });
      });

      //We also want to know what grappling related actions have been added to the combo list so that this action can be named appropriately on the fly.
      const isTryingToGrapple:boolean = this.getComboList().some(combo => {
        return combo.combatAction instanceof Grapple;
      });

      if(grapplesAppliedByOwner.length > 0){
        if(grapplesAppliedByOwner[0].getMode() == GrappleModes.Pull){
          nameToUse = 'Fix Grpl';
        }
        else{
          nameToUse = 'Pull Grpl';
        }
      }

      //We now have a starting point for what name to use, and we need to narrow in further given what appears on the combo list.
      if(isTryingToGrapple){
        if(nameToUse == this.name){//In this case, there are no grappled targets yet, but the player is trying to grapple. The default grapple mode is pull, so the SwitchGrappleMode will switch to fixed.
          nameToUse = 'Fix Grpl';
        }

        //We need to alternate between the two grapple modes, startiung with the one provided above. We alternate based on how many instances of SwitchGrappleMode there are in the combo list.
        const howManySwitches:number = this.getComboList()
          .filter(actionWRepeat => { return actionWRepeat.combatAction instanceof SwitchGrappleMode; })
          .reduce((acc, actionWRepeat) => { return acc + actionWRepeat.repeat; }, 0);

        console.log("How many switches:", howManySwitches);

        if(nameToUse == "Fix Grpl" && howManySwitches % 2 != 0){
          nameToUse = "Pull Grpl";
        }
        else if(nameToUse == "Pull Grpl" && howManySwitches % 2 != 0){
          nameToUse = "Fix Grpl";
        } 
      }

      this.switchGrappleMode.setIdToAffect(this.ownerId);

      return nameToUse;  
    }
    getCorrectAction(): CombatAction { 
      const nameToUse:string = this.getName();
      if(nameToUse != this.name){
        return this.switchGrappleMode.getCorrectAction();
      }
      else{
        return this.clone();
      }
    }

    override getShouldBypassUseLimits(): boolean {
      const nameToUse:string = this.getName();
      if(nameToUse != this.name){
        return this.switchGrappleMode.getShouldBypassUseLimits();
      }
      else{
        return this.bypassUseLimits;
      }
    }

    override getIsDirectional(): boolean {
      const nameToUse:string = this.getName();
      if(nameToUse != this.name){
        return this.switchGrappleMode.getIsDirectional();
      }
      else{
        return this.directional;
      }
    }
  }

  class SwitchGrappleMode extends CombatAction {
    idWhoseGrapplesToSwitch: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void,
      idWhoseGrapplesToSwitch: number = -1
    ){
      super('Switch Grapple Mode', false, ownerId, direction, updateEntity, refreshMap, getMap);

      this.idWhoseGrapplesToSwitch = idWhoseGrapplesToSwitch;
      this.bypassUseLimits = true;
    }

    setIdToAffect(newId:number): void{
      this.idWhoseGrapplesToSwitch = newId;
    }

    clone(newDirection?: Directions): CombatAction {
      return new SwitchGrappleMode(this.ownerId, newDirection || this.direction, this.getMap, this.updateEntity, this.refreshMap, this.idWhoseGrapplesToSwitch);
    }
    getName(): string {
      return this.name;
    }
    getCorrectAction(): CombatAction {
      return this.clone();
    }
    execute(): void {
      const grapplesToSwitch: ICondition[] = this.getMap().getEntitiesWithCondition(ConditionName.Grappled)
        .reduce<ICondition[]>((acc, entity) => { return [...acc, ...entity.getConditions()] }, [])
        .filter(condition => { return condition.getName() == ConditionName.Grappled && condition.getApplyerId() == this.ownerId; });

      grapplesToSwitch.forEach(grapple => {
        grapple.switchMode();
      });

      this.refreshMap();
    }
    getAnimations(): AnimationDetails[][] {
      const grapplesToSwitch: ICondition[] = this.getMap().getEntitiesWithCondition(ConditionName.Grappled)
        .reduce<ICondition[]>((acc, entity) => { return [...acc, ...entity.getConditions()] }, [])
        .filter(condition => { return condition.getName() == ConditionName.Grappled && condition.getApplyerId() == this.ownerId; });

      const targetIds:number[] = grapplesToSwitch.map(grapple => grapple.getAffectedId());

      const result:AnimationDetails[][] = [[]];
      targetIds.forEach(targetId => {
        result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Grapple, this.direction, targetId));
      });

      return result;
    }
  }

  
  class Kick extends CombatAction {
     
    damage: number;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Kick', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 2;
    }

    clone(newDirection:Directions = Directions.NONE) : Kick{
      const direction: Directions = newDirection != Directions.NONE ? newDirection : this.direction;
      
      return new Kick(this.ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        if(targetEntity.isMovable()){
          const directionVector: Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
          const targetPosition: Vector2 = Vector2.add(targetEntity.position, directionVector);
          const targetLocationData = map.locations?.[targetPosition.y]?.[targetPosition.x];

          if(targetLocationData && (!targetLocationData.entity || targetLocationData.entity.isWalkable())){
            targetEntity.position = targetPosition;
            targetEntity.setReactionFlag(ReactionFlags.WAS_PUSHED, this, this.ownerId);
          }
        }

        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_ATTACKED, this, this.ownerId);
        }

        this.updateEntity(targetEntity.id, targetEntity);
        return;
      }

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const targetId:number|undefined = this.getTargetId();

      const result:AnimationDetails[][] = [[CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId)]];
      if(targetId) {
        result[1] = [CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, targetId)];
        result[2] = [CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, this.direction, targetId)];
      }

      return result;
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }


  class BurningFloorAttack extends CombatAction {
     
    damage: number;
    ownerEntity: CombatEntity;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      damage: number,
      ownerEntity: CombatEntity,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void,
    ){
      super('Attack', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = damage;
      this.ownerEntity = ownerEntity;
    }
  
    clone() : BurningFloorAttack{
      return new BurningFloorAttack(this.ownerId, this.direction, this.damage, this.ownerEntity, this.getMap, this.updateEntity, this.refreshMap);
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

        targetEntity.takeDamage(this.damage, this, this.ownerId);
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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }


  function spawnBurningHazards(owner: CombatEntity | undefined, positions: Vector2[], getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void, getHazardsList: () => CombatHazard[], setHazardsList: (newHazards: CombatHazard[]) => void){
    const hazards =  getHazardsList();
    const dontHaveHazardsYet:Vector2[] = positions.filter((position) => {
      return !hazards.some((hazard) => Vector2.equals(hazard.position, position));
    });

    owner && dontHaveHazardsYet.push(owner.position);
    
    const newBurningFloors:CombatHazard[] = dontHaveHazardsYet.map((position) => {
      return new BurningFloor(
        IdGenerator.generateUniqueId(),
        position,
        getMap,
        updateEntity,
        refreshMap
      );
    });

    setHazardsList(hazards.concat(newBurningFloors));
  }

  //TODO: Replace instances of the original function with this one
  function spawnBurningHazardsWithSpawner(
    owner: CombatEntity | undefined | null, 
    positions: Vector2[], 
    getMap: () => CombatMapData, 
    updateEntity: (id:number, newEntity: CombatEntity) => void, 
    refreshMap: () => void, 
    entitySpawner: EntitySpawner
  ){
    const dontHaveHazardsYet:Vector2[] = positions.filter((position) => {
      if(owner && Vector2.equals(owner.position, position)){
        return false;
      }

      const entityAtLocation = getMap().locations?.[position.y]?.[position.x]?.entity;

      if(entityAtLocation && entityAtLocation instanceof CombatHazard){
        return false;
      }
      else{
        return true;
      }
    });
    
    const newBurningFloors:CombatHazard[] = dontHaveHazardsYet.map((position) => {
      return new BurningFloor(
        IdGenerator.generateUniqueId(),
        position,
        getMap,
        updateEntity,
        refreshMap
      );
    });

    for(const hazard of newBurningFloors){
      entitySpawner.spawnEntity(hazard);
    }
  }

  function despawnBurningHazardsWithSpawner(
    owner: CombatEntity | undefined | null, 
    positions: Vector2[], 
    getMap: () => CombatMapData, 
    entitySpawner: EntitySpawner
  ){
    const hazardsToDespawn:CombatEntity[] = positions.filter((position) => {
      const entityAtLocation = getMap().locations?.[position.y]?.[position.x]?.entity;

      return entityAtLocation && entityAtLocation instanceof BurningFloor;
    }).map((position) => {
      return getMap().locations?.[position.y]?.[position.x]?.entity as CombatEntity;
    });
    
    entitySpawner.despawnEntities(hazardsToDespawn.map((hazard) => hazard.id));
  }


  //TODO: Replace instances of getTargets that are local to teh specific classes with this one.
  /**
   * 
   * @param ownerId 
   * @param aoe 
   * @param getMap 
   * @param positionOverride If not undefined, this will be used in place of the owner's position 
   * @returns 
   */
  function getTargets(
    ownerId: number,
    aoe: AreaOfEffect,
    getMap: () => CombatMapData,
    positionOverride?: Vector2
  ): [number[], Vector2[], CombatEntity?]{
    const map: CombatMapData = getMap();
    const owner: CombatEntity|null = map.getEntityById(ownerId);

    if(!owner){return [[], []];}

    const [entities, positions] = aoe.getAffectedEntities(
      positionOverride ? positionOverride.x : owner.position.x, 
      positionOverride ? positionOverride.y : owner.position.y, 
      map,
      true,
    );
    const targetIds:number[] = entities.map((entity) => entity.id);
    return [targetIds, positions, owner];
  }



  class VolatileCanExplosion extends CombatAction {
     
    getHazardsList: () => CombatHazard[];
    setHazardsList: (newHazards: CombatHazard[]) => void;
    damage: number;
    aoe: AreaOfEffect;

    constructor(
      ownerId: number,
      getMap: () => CombatMapData,
      getHazardsList: () => CombatHazard[],
      setHazardsList: (newHazards: CombatHazard[]) => void,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Explosion', false, ownerId, undefined, updateEntity, refreshMap, getMap);
      this.getHazardsList = getHazardsList;
      this.setHazardsList = setHazardsList;
      this.damage = 5;

      this.aoe = new AreaOfEffect(0, Directions.NONE, 2, false);
    }
  
    clone(): CombatAction {
      return new VolatileCanExplosion(this.ownerId, this.getMap, this.getHazardsList, this.setHazardsList, this.updateEntity, this.refreshMap);
    }

    getTargets(): [number[], Vector2[], CombatEntity?]{
      const map: CombatMapData = this.getMap();
      const owner: CombatEntity|null = map.getEntityById(this.ownerId);

      if(!owner){return [[], []];}

      const [entities, positions] = this.aoe.getAffectedEntities(owner.position.x, owner.position.y, map, true, true);
      const targetIds:number[] = entities.map((entity) => entity.id);
      return [targetIds, positions, owner];
    }

    execute() {
      const [targetIds, positions, owner] = this.getTargets();
      const map: CombatMapData = this.getMap();
      
      //Destroy the owner
      owner?.killEntity();

      //Damage any entities in the area of effect
      targetIds.forEach((targetId) => {
        const targetEntity = map.getEntityById(targetId)?.clone();
        if(!targetEntity){
          return;
        }

        targetEntity.takeDamage(this.damage, this, this.ownerId);

        //destroy walls
        if(targetEntity instanceof Wall){
          targetEntity.killEntity();
        }

        this.updateEntity(targetEntity.id, targetEntity);
      });

      //Spawn burning hazards
      // const hazards = this.getHazardsList();
      // const dontHaveHazardsYet:Vector2[] = positions.filter((position) => {
      //   return !hazards.some((hazard) => Vector2.equals(hazard.position, position));
      // });

      // owner && dontHaveHazardsYet.push(owner.position);
      
      // const newBurningFloors:CombatHazard[] = dontHaveHazardsYet.map((position) => {
      //   return new BurningFloor(
      //     IdGenerator.generateUniqueId(),
      //     position,
      //     this.getMap,
      //     this.updateEntity,
      //     this.refreshMap
      //   );
      // });

      // this.setHazardsList(hazards.concat(newBurningFloors));
      spawnBurningHazards(
        owner,
        positions,
        this.getMap,
        this.updateEntity,
        this.refreshMap,
        this.getHazardsList,
        this.setHazardsList
      );

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const [targetIds, positions] = this.getTargets();
      const map: CombatMapData = this.getMap();

      const result:AnimationDetails[][] = [[],[]];
      positions.forEach((position) => {
        result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Explosion, Directions.NONE, -1, false, position));
      });
      
      targetIds.forEach((targetId) => {
        result[1].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, Directions.NONE, targetId));
      });
      
      return result;
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }





  class Block extends CombatAction {
    constructor(ownerId: number, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void, getMap: () => CombatMapData){
      super('Block', false, ownerId, Directions.NONE, updateEntity, refreshMap, getMap);
    }

    clone() : Block{
      return new Block(this.ownerId, this.updateEntity, this.refreshMap, this.getMap);
    }

    execute() {
      // console.log('Blocking');
      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      return [[CombatAnimationFactory.createAnimation(CombatAnimationNames.Block, Directions.NONE, this.ownerId)]];
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }

  class Move extends  CombatAction {
     

    constructor(ownerId: number, direction: Directions = Directions.NONE, getMap: () => CombatMapData, updateEntity: (id:number, newEntity: CombatEntity) => void, refreshMap: () => void){
      super('Move', true, ownerId, direction, updateEntity, refreshMap, getMap);
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
          owner.setReactionFlag(ReactionFlags.BUMPED_ON_SOLID_SURFACE, this, this.ownerId);
          this.refreshMap();
        }
        else{
          updatedEntity.position = targetPosition;
          this.updateEntity(owner.id, updatedEntity);

          if(owner instanceof CombatPlayer){
            CombatEntity.setEntityWideReaction(ReactionFlags.PLAYER_DID_MOVE, this, this.ownerId);
          }
  
          CombatEntity.setEntityWideReaction(ReactionFlags.ENTITY_DID_MOVE, this, this.ownerId);
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

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(this.direction); }

  }

  class PullRange5 extends CombatAction {
     
    damage: number;
    aoe: AreaOfEffect;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Pull', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 2;

      this.aoe = new AreaOfEffect(5, direction, 0, false);
    }
  
    clone(): CombatAction {
      return new PullRange5(this.ownerId, this.direction, this.getMap, this.updateEntity, this.refreshMap);
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
        targetEntity.takeDamage(this.damage, this, this.ownerId);

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
          targetEntity.takeDamage(this.damage, this, this.ownerId);
        }
        else{
          targetEntity.position = Vector2.add(targetEntity.position, pullVector);
        }
        this.updateEntity(targetEntity.id, targetEntity);
        
        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_PULLED, this, this.ownerId);
        }

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

        // result[3].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, targetIds[i]));

        this.updateEntity(targetEntity.id, targetEntity);
        
        previousEntity = targetEntity;
        previousDidBump = bumped;
      }      


      return result;
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }
  }

  class PushRange5 extends CombatAction {
     
    damage: number;
    aoe: AreaOfEffect;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Push', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 2;

      this.aoe = new AreaOfEffect(5, direction, 0, false);
    }
  
    clone(): CombatAction {
      return new PushRange5(this.ownerId, this.direction, this.getMap, this.updateEntity, this.refreshMap);
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
      //   targetEntity.takeDamage(this.damage, this);
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
        targetEntity.takeDamage(this.damage, this, this.ownerId);

        const forwardPosition:Vector2 = Vector2.add(targetEntity.position, forwardsVector);
        if(previousEntity){
          const backwardPosition:Vector2 = Vector2.add(previousEntity.position, backwardsVector);
          const currentIsBehindPrevious:boolean = Vector2.equals(targetEntity.position, backwardPosition);
          if(currentIsBehindPrevious){
            bumped = previousDidBump;
          }
        }else if(
          (map.locations?.[forwardPosition.y]?.[forwardPosition.x] == undefined) ||

          (
            map.locations[forwardPosition.y][forwardPosition.x].entity &&
            !map.locations[forwardPosition.y][forwardPosition.x].entity?.isWalkable()
          )
        ){
          bumped = true;
        }

        if(bumped){
          targetEntity.takeDamage(this.damage, this, this.ownerId);
        }
        else{
          targetEntity.position = Vector2.add(targetEntity.position, pushVector);
        }
        this.updateEntity(targetEntity.id, targetEntity);
        
        if(targetEntity instanceof CombatEnemy){
          targetEntity.setReactionFlag(ReactionFlags.WAS_PUSHED, this, this.ownerId);
        }

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
          (map.locations?.[forwardPosition.y]?.[forwardPosition.x] == undefined) ||

          (
            map.locations[forwardPosition.y][forwardPosition.x].entity &&
            !map.locations[forwardPosition.y][forwardPosition.x].entity?.isWalkable()
          )
        ){
          bumped = true;
        }

        if(bumped){
          result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.ShortBump, this.direction, entities[i].id));
        }
        else{
          result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Move, this.direction, entities[i].id));
        }

        // result[3].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, entities[i].id));
        
        previousEntity = entities[i];
        previousDidBump = bumped;
      }

      return result;
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }
  }

  class Burn extends CombatAction {
     
    damage: number;
    aoe: AreaOfEffect;

    constructor(
      ownerId: number,
      direction: Directions = Directions.NONE,
      getMap: () => CombatMapData,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super('Burn', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.damage = 8;

      this.aoe = new AreaOfEffect(8, direction, 0, false);
    }
  
    clone(): CombatAction {
      return new Burn(this.ownerId, this.direction, this.getMap, this.updateEntity, this.refreshMap);
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
      
      for(let i = targetIds.length-1; i >= 0; i--){
        const targetEntity:CombatEntity|undefined = map.getEntityById(targetIds[i])?.clone();
        if(!targetEntity){
          continue;
        }
        
        // console.log("Target entity found");
        targetEntity.takeDamage(this.damage, this, this.ownerId);
        this.updateEntity(targetEntity.id, targetEntity);
      }

      this.refreshMap();
    }

    getAnimations(): AnimationDetails[][] {
      const [targetIds, positions, entities] = this.getTargets();
      const map: CombatMapData = this.getMap();

      const result:AnimationDetails[][] = [[],[],[]];
      result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId));

      positions.forEach((position) => {
        result[1].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Pyro, this.direction, -1, false, position));
      });

      for(let i = entities.length-1; i >= 0; i--){
        result[2].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Hurt, this.direction, entities[i].id));
      }

      return result;
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }

  class Fireball extends CombatAction {
     

    //TODO: Change earlier actions to use this when they spawn hazards.
    private entitySpawner: EntitySpawner;
    private radius = 2;

    private combatHazardFireballFactory: CombatHazardFireballFactory;

    constructor(
      ownerId: number,
      direction: Directions,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void,
      entitySpawner: EntitySpawner,
      getMap: () => CombatMapData,
      combatHazardFireballFactory: CombatHazardFireballFactory
    ){
      super('Fireball', true, ownerId, direction, updateEntity, refreshMap, getMap);
      this.entitySpawner = entitySpawner;

      this.combatHazardFireballFactory = combatHazardFireballFactory;
    }

    clone(newDirection?: Directions): CombatAction {
      return new Fireball(
        this.ownerId,
        newDirection ? newDirection : this.direction,
        this.updateEntity,
        this.refreshMap,
        this.entitySpawner,
        this.getMap,
        this.combatHazardFireballFactory
      );
    }
    execute(): void {
      // console.log('Fireball');

      const player:CombatEntity|null = this.getMap().getPlayer();
      if(!player){return;}

      const playerPosition:Vector2 = player.position;
      const directionVector:Vector2 = DirectionsUtility.getVectorFromDirection(this.direction);
      const increment:number = this.radius + 1;
      const positionToSpawnAt:Vector2 = new Vector2(playerPosition.x + directionVector.x * increment, playerPosition.y + directionVector.y * increment);

      if(
        !this.getMap().isInBounds(positionToSpawnAt) ||
        this.getMap().locations[positionToSpawnAt.y][positionToSpawnAt.x].entity
      ){
        // console.log('Fireball blocked');
        this.refreshMap();
        return;
      }

      const fireball:CombatHazard = this.combatHazardFireballFactory.createFireball(positionToSpawnAt, this.direction);
      this.entitySpawner.spawnEntity(fireball);

      const aoe = new AreaOfEffect(0, this.direction, this.radius, false);
      spawnBurningHazardsWithSpawner(
        player,
        aoe.getAffectedCoordinates(positionToSpawnAt.x, positionToSpawnAt.y, this.getMap()),
        this.getMap,
        this.updateEntity,
        this.refreshMap,
        this.entitySpawner
      )

      this.refreshMap();
    }
    getAnimations(): AnimationDetails[][] {
      const result:AnimationDetails[][] = [[]];
      result[0].push(CombatAnimationFactory.createAnimation(CombatAnimationNames.Attack, this.direction, this.ownerId));

      return result;
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }

  class SpawnBurningRadius extends CombatAction {
    private radius:number;
    private entitySpawner: EntitySpawner;

    constructor(
      ownerId: number,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void,
      entitySpawner: EntitySpawner,
      getMap: () => CombatMapData,
      radius: number = 2
    ){
      super('SpawnBurningRadius', false, ownerId, Directions.NONE, updateEntity, refreshMap, getMap);
      this.radius = radius;
      this.entitySpawner = entitySpawner;
    }

    clone(newDirection?: Directions): CombatAction {
      return new SpawnBurningRadius(
        this.ownerId,
        this.updateEntity,
        this.refreshMap,
        this.entitySpawner,
        this.getMap,
        this.radius
      );
    }
    execute(): void {
      const [ids, positions] = getTargets(this.ownerId, new AreaOfEffect(0, this.direction, this.radius, false), this.getMap);
      spawnBurningHazardsWithSpawner(
        this.getMap().getPlayer(),
        positions,
        this.getMap,
        this.updateEntity,
        this.refreshMap,
        this.entitySpawner
      );

      this.refreshMap();
    }
    getAnimations(): AnimationDetails[][] {
      return [[]];
    }
    
    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }

  class DespawnBurningRadius extends CombatAction {
    private radius:number;
    private entitySpawner: EntitySpawner;

    constructor(
      ownerId: number,
      entitySpawner: EntitySpawner,
      updateEntity: (id:number, newEntity: CombatEntity) => void,
      refreshMap: () => void,
      getMap: () => CombatMapData,
      radius: number = 2,
    ){
      super('DespawnBurningRadius', false, ownerId, Directions.NONE, updateEntity, refreshMap, getMap);
      this.radius = radius;
      this.getMap = getMap;
      this.entitySpawner = entitySpawner;
    }

    clone(newDirection?: Directions): CombatAction {
      return new DespawnBurningRadius(
        this.ownerId,
        this.entitySpawner,
        this.updateEntity,
        this.refreshMap,
        this.getMap,
        this.radius
      );
    }
    execute(): void {
      const [ids, positions] = getTargets(this.ownerId, new AreaOfEffect(0, this.direction, this.radius, false), this.getMap);
      
      despawnBurningHazardsWithSpawner(
        this.getMap().getPlayer(),
        positions,
        this.getMap,
        this.entitySpawner
      );

      this.refreshMap();
    }
    getAnimations(): AnimationDetails[][] {
      return [[]];
    }

    getName(): string{ return this.name; }
    getCorrectAction(): CombatAction { return this.clone(); }

  }


  type CombatActionSeed = {
    key: string;
    uses: number;
    id: number;
  }
  
export default CombatAction;
export {SwitchGrappleMode, Grapple, Slice, Lacerate, DespawnBurningRadius, SpawnBurningRadius, Fireball, Burn, Kick, Punch, Chop, Attack, Block, Move, CombatActionWithRepeat, CombatActionWithUses, PullRange5, PushRange5, BurningFloorAttack, VolatileCanExplosion};
export type { CombatActionSeed };