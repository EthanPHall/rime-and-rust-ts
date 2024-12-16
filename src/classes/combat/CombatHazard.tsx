import { ISettingsManager } from "../../context/misc/SettingsContext";
import { ImprovedMotionAnimation } from "../../hooks/combat/useCombatHazardAnimations";
import AnimationDetails from "../animation/AnimationDetails";
import CombatAnimationFactory, { CombatAnimationNames } from "../animation/CombatAnimationFactory";
import Directions from "../utility/Directions";
import IdGenerator from "../utility/IdGenerator";
import MapUtilities from "../utility/MapUtilities";
import Vector2 from "../utility/Vector2";
import CombatAction, { Attack, BurningFloorAttack, CombatActionWithUses, DespawnBurningRadius, Move, SpawnBurningRadius } from "./CombatAction";
import CombatActionFactory from "./CombatActionFactory";
import CombatEnemy, { AIHandler } from "./CombatEnemy";
import CombatEntity from "./CombatEntity";
import CombatMapData from "./CombatMapData";
import EntitySpawner from "./EntitySpawner";
import Reaction from "./Reactions/Reaction";
import ReactionFlags from "./Reactions/ReactionFlags";
import TurnTaker from "./TurnTaker";

abstract class CombatHazard extends CombatEntity{
    solid: boolean;
    intangible: boolean;
    onlyDisplayOneInSidebar: boolean;
    previousEntityOnThisSpace: CombatEntity | null = null;
  
    constructor(
      id: number, 
      hp: number, 
      maxHp: number, 
      symbol: string, 
      name: string, 
      position: Vector2,
      getMap: ()=>CombatMapData,
      solid: boolean, 
      description: string = "", 
      onlyDisplayOneInSidebar: boolean = false,
      intangible: boolean = false
    ){
      super(id, hp, maxHp, symbol, name, position, getMap, description);
      this.solid = solid;
      this.onlyDisplayOneInSidebar = onlyDisplayOneInSidebar;
      this.intangible = intangible;
    }

    isWalkable(): boolean {
      return this.intangible;
    }
    isMovable(): boolean {
      return false;
    }
    getDefaultAnimation(): ImprovedMotionAnimation|null {
      return null;
    }

    protected newEntityIsDifferent(newEntity: CombatEntity): boolean{
      return newEntity.id !== this.previousEntityOnThisSpace?.id;
    }

    abstract handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null;
    abstract getActionForNewEntityOnSpace(newEntity: CombatEntity|null): CombatAction|null;

    
  }
  
  class Wall extends CombatHazard{
    static WALL_HP = 10;
    static WALL_DESCRIPTION:string = 'Sturdy walls. Click a specific wall in the map to see its health.';
  
    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, getMap: ()=>CombatMapData, solid: boolean){
      super(id, hp, maxHp, symbol, name, position, getMap, solid, Wall.WALL_DESCRIPTION, true);
    }
  
    static createDefaultWall(position: Vector2, getMap: ()=>CombatMapData): Wall{
      return new Wall(IdGenerator.generateUniqueId(), Wall.WALL_HP, Wall.WALL_HP, '#', 'Wall', position, getMap, true);
    }
  
    static createDefaultWalls(startEndPointPair: {start:Vector2, end:Vector2}[], getMap: ()=>CombatMapData): Wall[]{
      const walls: Wall[] = [];
  
      startEndPointPair.forEach(pair => {
        const line:Vector2[] = MapUtilities.getLineBetweenPoints(pair.start, pair.end);
  
        line.forEach(point => {
          walls.push(Wall.createDefaultWall(point, getMap));
        });
      });
  
      return walls;
    }

    clone(): CombatHazard{
      return new Wall(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.getMap, this.solid);
    }

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      this.previousEntityOnThisSpace = newEntity;
      return null;
    }
    getActionForNewEntityOnSpace(newEntity: CombatEntity | null): CombatAction | null {
      return null;
    }
  }

  class InvisibleWall extends CombatHazard{
    static WALL_HP = Infinity;
    static WALL_DESCRIPTION:string = '';
  
    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, getMap: ()=>CombatMapData, solid: boolean){
      super(id, InvisibleWall.WALL_HP, InvisibleWall.WALL_HP, "0", "invisible-wall", position, getMap, solid, InvisibleWall.WALL_DESCRIPTION, true);
    }
  
    static createDefaultWall(position: Vector2, getMap: ()=>CombatMapData): InvisibleWall{
      return new InvisibleWall(IdGenerator.generateUniqueId(), InvisibleWall.WALL_HP, InvisibleWall.WALL_HP, '0', 'invisible-wall', position, getMap, true);
    }
  
    static createDefaultWalls(startEndPointPair: {start:Vector2, end:Vector2}[], getMap: ()=>CombatMapData): InvisibleWall[]{
      const walls: InvisibleWall[] = [];
  
      startEndPointPair.forEach(pair => {
        const line:Vector2[] = MapUtilities.getLineBetweenPoints(pair.start, pair.end);
  
        line.forEach(point => {
          walls.push(InvisibleWall.createDefaultWall(point, getMap));
        });
      });
  
      return walls;
    }

    clone(): CombatHazard{
      return new InvisibleWall(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.getMap, this.solid);
    }

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      this.previousEntityOnThisSpace = newEntity;
      return null;
    }
    getActionForNewEntityOnSpace(newEntity: CombatEntity | null): CombatAction | null {
      return null;
    }
  }






  
  class VolatileCanister extends CombatHazard{
    actionFactory: CombatActionFactory;
    addToComboList: (action: CombatAction) => void;
    
    constructor(
      id:number, 
      symbol: string, 
      name: string, 
      position: Vector2, 
      getMap: ()=>CombatMapData,
      solid: boolean,
      actionFactory: CombatActionFactory,
      addToComboList: (action: CombatAction) => void
    ){
      super(id, 2, 2, symbol, name, position, getMap, solid);
      this.actionFactory = actionFactory;
      this.addToComboList = addToComboList;
    }

    static createDefaultVolatileCanister(position:Vector2, actionFactory: CombatActionFactory, addToComboList: (action: CombatAction) => void, getMap: ()=>CombatMapData):VolatileCanister{
      return new VolatileCanister(
        IdGenerator.generateUniqueId(),
        '+',
        'Volatile Canister',
        position,
        getMap,
        false,
        actionFactory,
        addToComboList
      );
    }

    isMovable(): boolean {
      return true;
    }

    clone(): CombatHazard{
      const newCanister:VolatileCanister = new VolatileCanister(
        this.id,
        this.symbol,
        this.name,
        this.position,
        this.getMap,
        this.solid,
        this.actionFactory,
        this.addToComboList
      );
      newCanister.hp = this.hp;

      return newCanister;
    }

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      this.previousEntityOnThisSpace = newEntity;
      return null;
    }
    getActionForNewEntityOnSpace(newEntity: CombatEntity | null): CombatAction | null {
      return null;
    }

    onDeath(): void {
      this.addToComboList(this.actionFactory.createVolatileCanExplosion(this.id));
    }

    takeDamage(damage: number, damagingAction: CombatAction): void {
      super.takeDamage(damage, damagingAction, this.id);

      if(this.reactionTriggerList[ReactionFlags.DID_DIE]){
        this.hp = .1;
      }
    }
    getReaction(): Reaction | null {
      if(this.reactionTriggerList[ReactionFlags.DID_DIE] !== undefined){
        //the explosion action kills the canister
        const explosion:CombatAction = this.actionFactory.createVolatileCanExplosion(this.id);
        return new Reaction(explosion, 200);
      }

      return null;
    }
  }











  class BurningFloor extends CombatHazard{
    static DESCRIPTION:string = 'Engulfed in flames, this space deals damage to anything that steps on it.';

    damage: number;
    updateEntity: (id: number, newEntity: CombatEntity) => void;
    refreshMap: () => void;

    constructor(
      id:number, 
      position: Vector2, 
      getMap: ()=>CombatMapData,
      updateEntity: (id: number, newEntity: CombatEntity) => void,
      refreshMap: () => void
    ){
      super(id, 999, 999, 'f', "Burning Floor", position, getMap, false, BurningFloor.DESCRIPTION, true, true);
      this.damage = 5;
      this.updateEntity = updateEntity;
      this.refreshMap = refreshMap;
    }

    clone(): CombatHazard{
      return new BurningFloor(
        this.id, 
        this.position, 
        this.getMap,
        this.updateEntity,
        this.refreshMap
      );
    }

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      let updatedEntity:CombatEntity|null = null;
      
      // if(newEntity !== null && this.newEntityIsDifferent(newEntity)){
      //   updatedEntity = newEntity.clone();
      //   updatedEntity.takeDamage(this.damage);
      // }
      
      // this.previousEntityOnThisSpace = newEntity;
      return updatedEntity;
    }
    getActionForNewEntityOnSpace(newEntity: CombatEntity | null): CombatAction | null {
      let action:CombatAction|null = null;
      
      if(newEntity !== null && this.newEntityIsDifferent(newEntity)){
        // action = new Attack(this.id, Directions.NONE, this.getMap, this.updateEntity, this.refreshMap);
        action = new BurningFloorAttack(this.id, Directions.NONE, this.damage, this, this.getMap, this.updateEntity, this.refreshMap);
      }
      
      this.previousEntityOnThisSpace = newEntity;

      return action;
    }

    getDefaultAnimation(): ImprovedMotionAnimation|null {
      return new ImprovedMotionAnimation(this, {color:["#ff0000", "#ffbb4d"]}, {times:[0, 1], duration: 1, repeat: Infinity, repeatType: "reverse"});
    }
}

class FireballAI implements AIHandler{
  private entity: CombatEntity;
  private playerPosition: Vector2;
  private playerId: number;
  private getMap: () => CombatMapData;
  private actionMove: CombatActionWithUses;
  private actionSpawnAOE: CombatActionWithUses;
  private actionDespawnAOE: CombatActionWithUses;
  private direction:Directions;
  private entitySpawner: EntitySpawner

  constructor(entity: CombatEntity, playerPosition: Vector2, playerId: number, getMap: () => CombatMapData,
    updateEntity: (id:number, newEntity: CombatEntity) => void,
    refreshMap: () => void,
    direction:Directions = Directions.RIGHT,
    entitySpawner: EntitySpawner
  ){
    this.entity = entity;
    this.playerPosition = playerPosition;
    this.playerId = playerId;
    this.getMap = getMap;
    this.direction = direction;
    this.entitySpawner = entitySpawner;

    this.actionMove = new CombatActionWithUses(
      new Move(this.entity.id, this.direction, this.getMap, updateEntity, refreshMap),
      3
    );

    this.actionSpawnAOE = new CombatActionWithUses(
      new SpawnBurningRadius(
        this.entity.id,
        updateEntity,
        refreshMap,
        entitySpawner,
        getMap,
      ),
      1
    );

    this.actionDespawnAOE = new CombatActionWithUses(
      new DespawnBurningRadius(
        this.entity.id,
        entitySpawner,
        updateEntity,
        refreshMap,
        getMap,
      ),
      1
    );
  }

  handleAI():CombatAction[]{
    const actions:CombatAction[] = [];

    actions.push(this.actionDespawnAOE.action);
    for(let i = 0; i < this.actionMove.uses; i++){
      actions.push(this.actionMove.action);
    }
    actions.push(this.actionSpawnAOE.action);

    return actions;
  }
}

class Fireball extends CombatHazard implements TurnTaker{
  static DESCRIPTION:string = 'A ball that radiates intense heat.';

  damage: number;
  playerId: number = -1;
  settingsManager:ISettingsManager;
  entitySpawner: EntitySpawner;

  updateEntity: (id: number, newEntity: CombatEntity) => void;
  refreshMap: () => void;
  
  combatEntity: CombatEntity = this;

  advanceTurn: () => void;
  addActionToList: (action: CombatAction) => void;
  executeActionsList: () => void;
  
  startTurn(): void {
    this.executeTurn();
  }
  endTurn(): void {
    // this.advanceTurn();
  }

  canTakeTurn(): boolean {
    return true;
  }

  private direction:Directions;
  
  constructor(
    id:number, 
    position: Vector2,
    direction:Directions,
    entitySpawner: EntitySpawner,
    advanceTurn: () => void,
    addActionToList: (action: CombatAction) => void,
    executeActionsList: () => void,
    getMap: ()=>CombatMapData,
    updateEntity: (id: number, newEntity: CombatEntity) => void,
    refreshMap: () => void,
    settingsManager:ISettingsManager
  ){
    //TODO: Define display data for entities in a json file
    super(id, 999, 999, '\xA4', "Fireball", position, getMap, false, Fireball.DESCRIPTION, true, true);
    this.damage = 5;
    this.updateEntity = updateEntity;
    this.refreshMap = refreshMap;
    this.advanceTurn = advanceTurn;
    this.addActionToList = addActionToList;
    this.executeActionsList = executeActionsList;
    this.settingsManager = settingsManager;
    this.direction = direction;
    this.entitySpawner = entitySpawner;
  }

  async executeTurn(): Promise<void> {
    if(this.playerId == -1){
      this.playerId = this.getMap().getPlayer()?.id || -1;
    }

    const playerPosition:Vector2|undefined = this.getMap().getEntityById(this.playerId)?.position;

    await new Promise((resolve) => setTimeout(resolve, this.settingsManager.getCorrectTiming(CombatEnemy.TURN_START_DELAY)));

    if(playerPosition){
      const aiHandler = new FireballAI(this.combatEntity, playerPosition, this.playerId, this.getMap, this.updateEntity, this.refreshMap, this.direction, this.entitySpawner);
      const aiActions = aiHandler.handleAI();

      for(const action of aiActions){
        this.addActionToList(action);
        await new Promise((resolve) => setTimeout(resolve, this.settingsManager.getCorrectTiming(CombatEnemy.ACTION_DELAY)));
      }
    }

    setTimeout(() => {
      this.executeActionsList();
    }, this.settingsManager.getCorrectTiming(CombatEnemy.ACTION_DELAY));
  }

  clone(): CombatHazard{
    return new Fireball(
      this.id, 
      this.position,
      this.direction,
      this.entitySpawner,
      this.advanceTurn,
      this.addActionToList,
      this.executeActionsList,
      this.getMap,
      this.updateEntity,
      this.refreshMap,
      this.settingsManager
    );
  }

  handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
    let updatedEntity:CombatEntity|null = null;
    
    // if(newEntity !== null && this.newEntityIsDifferent(newEntity)){
    //   updatedEntity = newEntity.clone();
    //   updatedEntity.takeDamage(this.damage);
    // }
    
    // this.previousEntityOnThisSpace = newEntity;
    return updatedEntity;
  }
  getActionForNewEntityOnSpace(newEntity: CombatEntity | null): CombatAction | null {
    let action:CombatAction|null = null;
    
    if(newEntity !== null && this.newEntityIsDifferent(newEntity)){
      action = new BurningFloorAttack(this.id, Directions.NONE, this.damage, this, this.getMap, this.updateEntity, this.refreshMap);
    }
    
    this.previousEntityOnThisSpace = newEntity;
    return action;
  }

  getDefaultAnimation(): ImprovedMotionAnimation|null {
    return new ImprovedMotionAnimation(this, {color:["#ff0000", "#ffbb4d"], scaleX:[1, 1.2], scaleY:[1,1.2]}, {times:[0, 1], duration: 1, repeat: Infinity, repeatType: "reverse"});
  }
}



export default CombatHazard;
export { InvisibleWall, Wall, VolatileCanister, BurningFloor, Fireball };