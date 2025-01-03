import { ISettingsManager, SettingsManager } from "../../context/misc/SettingsContext";
import PathfindingUtil, { PathfindingAttitude } from "../ai/PathfindingUtil";
import Directions, { DirectionsUtility } from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import AIHandler from "./AIHandler";
import CombatAction, {  Attack, Chop, CombatActionWithRepeat, CombatActionWithUses, Move, Punch, Swipe } from "./CombatAction";
import CombatEntity from "./CombatEntity";
import CombatMapData from "./CombatMapData";
import ConditionDebug from "./Conditions/ConditionDebug";
import ICondition from "./Conditions/ICondition";
import IActionExecutor from "./IActionExecutor";
import AttackWhenBump from "./Reactions/AttackWhenBump";
import Reaction from "./Reactions/Reaction";
import TurnTaker from "./TurnTaker";

type KeyActionPairs = { [ k: string ]: CombatActionWithUses };

abstract class CombatEnemy extends CombatEntity implements TurnTaker{
  static ACTION_DELAY = 600;
  static TURN_START_DELAY = 1500;
  static ACTION_SHOW_OFF_DELAY = 1500;

  actions: { [ k: string ]: CombatActionWithUses };
  playerId: number;

  settingsManager:ISettingsManager;

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
    this.resetToDefaults();

    this.applyConditions();

    this.executeTurn();
  }
  endTurn(): void {
    // console.log(`${this.name} is ending their turn.`);
    
    // this.cleanUpConditions();
    
    // this.advanceTurn();
  }

  abstract executeTurn(): Promise<void>;

  setHp(hp: number): void{
    this.hp = hp;
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
    refreshMap: () => void,
    settingsManager:ISettingsManager,
    conditions: ICondition[] = []
  ){
    super(id, hp, maxHp, symbol, name, position, getMap);
    this.advanceTurn = advanceTurn;
    this.addActionToList = addActionToList;
    this.executeActionsList = executeActionsList;
    this.updateEntity = updateEntity;
    this.refreshMap = refreshMap;
    this.actions = {};
    this.playerId = getMap().getPlayer()?.id || -1;
    this.settingsManager = settingsManager;
    this.conditions = conditions;
  }

  abstract clone(): CombatEnemy; 
  // {
  //   const clone = new RustedShambler(
  //     this.id, 
  //     this.position, 
  //     this.advanceTurn,
  //     this.addActionToList,
  //     this.executeActionsList,
  //     this.getMap,
  //     this.updateEntity,
  //     this.refreshMap,
  //     this.settingsManager
  //   );

  //   clone.setHp(this.hp);

  //   return clone;
  // }
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
    refreshMap: () => void,
    settingsManager:ISettingsManager,
    conditions: ICondition[] = []
  ){
    super(
      id, 
      3, 
      3, 
      'S', 
      'Rusted Shambler', 
      position, 
      advanceTurn, 
      addActionToList, 
      executeActionsList,
      getMap,
      updateEntity,
      refreshMap,
      settingsManager,
      conditions
    );

    this.actions = {
      attack: new CombatActionWithUses(this.getAttackAction() as CombatAction, 2),
      move: new CombatActionWithUses(this.getMoveAction() as CombatAction, 4),
    };
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
      this.refreshMap,
      this.settingsManager,
      this.conditions
    );

    clone.setHp(this.hp);

    clone.setReactionTriggerList(this.reactionTriggerList);

    // clone.resetToDefaults();
    // clone.applyConditions();

    return clone;
  }

  async executeTurn(): Promise<void> {
    if(this.playerId == -1){
      this.playerId = this.getMap().getPlayer()?.id || -1;
    }
    
    const playerPosition:Vector2|undefined = this.getMap().getEntityById(this.playerId)?.position;
    
    await new Promise((resolve) => setTimeout(resolve, this.settingsManager.getCorrectTiming(CombatEnemy.TURN_START_DELAY)));
    
    if(playerPosition){
      const aiHandler = new RustedShamblerAI(this, playerPosition, this.playerId, this.getMap, this.actions as {move: CombatActionWithUses, attack: CombatActionWithUses});
      const actions = aiHandler.handleAI();

      for(const action of actions){
        this.addActionToList(action);
        await new Promise((resolve) => setTimeout(resolve, CombatEnemy.ACTION_DELAY));
      }
    }

    setTimeout(() => {
      this.executeActionsList();
    }, this.settingsManager.getCorrectTiming(CombatEnemy.ACTION_DELAY));
  }

  getAttackAction(): CombatAction | null {
    return new Punch(this.id, undefined, this.getMap, this.updateEntity, this.refreshMap);
  }
  getMoveAction(): CombatAction | null {
    return new Move(this.id, undefined, this.getMap, this.updateEntity, this.refreshMap);
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
    refreshMap: () => void,
    settingsManager:ISettingsManager,
    conditions: ICondition[] = []
  ){
    super(
      id, 
      10, 
      10, 
      'B', 
      'Rusted Brute', 
      position,
      advanceTurn, 
      addActionToList, 
      executeActionsList,
      getMap,
      updateEntity,
      refreshMap,
      settingsManager,
      conditions
    );

    this.actions = {
      attack: new CombatActionWithUses(this.getAttackAction() as CombatAction, 2),
      move: new CombatActionWithUses(this.getMoveAction() as CombatAction, 5),
      swipe: new CombatActionWithUses(this.getSwipeAction() as CombatAction, 1)
    };

    this.default_reactionGenerators.push(new AttackWhenBump(this.actions));
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
      this.refreshMap,
      this.settingsManager,
      this.conditions
    );

    clone.setHp(this.hp);
    clone.setReactionTriggerList(this.reactionTriggerList);

    return clone;
  }

  override  getReaction(): Reaction|null {
    let potentialReaction: Reaction|null = null;
    
    for(const generator of this.working_reactionGenerators){
      // console.log("Getting reaction for entity", this);
      const reaction = generator.getReaction(this.id, this.getMap, this.reactionTriggerList, this.actions.swipe.action);
  
      if(reaction && (!potentialReaction || reaction.priority > potentialReaction.priority)){
        potentialReaction = reaction;
      }
    }

    return potentialReaction;
  }


  async executeTurn(): Promise<void> {
    if(this.playerId == -1){
      this.playerId = this.getMap().getPlayer()?.id || -1;
    }

    const playerPosition:Vector2|undefined = this.getMap().getEntityById(this.playerId)?.position;

    await new Promise((resolve) => setTimeout(resolve, this.settingsManager.getCorrectTiming(CombatEnemy.TURN_START_DELAY)));

    if(playerPosition){
      const aiHandler = new RustedBruteAI(this, playerPosition, this.playerId, this.getMap, this.actions as {move: CombatActionWithUses, attack: CombatActionWithUses});
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

  getAttackAction(): CombatAction | null {
    return new Chop(this.id, undefined, this.getMap, this.updateEntity, this.refreshMap);
  }
  getMoveAction(): CombatAction | null {
    return new Move(this.id, undefined, this.getMap, this.updateEntity, this.refreshMap);
  }
  getSwipeAction(): CombatAction | null {
    return new Swipe(this.id, undefined, this.getMap, this.updateEntity, this.refreshMap);
  }
}

class RustedShamblerAI implements AIHandler{
  entity: CombatEntity;
  playerPosition: Vector2;
  playerId: number;
  getMap: () => CombatMapData;
  actions: {move: CombatActionWithUses, attack: CombatActionWithUses};

  constructor(entity: CombatEntity, playerPosition: Vector2, playerId: number, getMap: () => CombatMapData, actions: {move: CombatActionWithUses, attack: CombatActionWithUses}){
    this.entity = entity;
    this.playerPosition = playerPosition;
    this.playerId = playerId;
    this.getMap = getMap;
    this.actions = actions;
  }

  handleAI():CombatAction[]{
    const actions:CombatAction[] = [];
    const directions = PathfindingUtil.findPath(this.entity.position, this.playerPosition, this.getMap(), PathfindingAttitude.DUMB);

    //Handle movement actions.
    const loopLimit = Math.min(directions.length, this.actions.move.uses);
    for(let i = 0; i < loopLimit; i++){
      actions.push(this.actions.move.action.clone(directions[i]));
    }

    //Handle attack actions.
    const targetPosition = directions.length != 0 ? PathfindingUtil.findStoppingPoint(this.entity.position, directions, this.actions.move.uses) : this.entity.position;
    if(targetPosition){
      const neighbors:Vector2[] = DirectionsUtility.getNeighbors(targetPosition, this.getMap());
      let playerLocation:Vector2|null = null;
      
      for(let i = 0; i < this.actions.attack.uses; i++){
        //Don't go through the inner loop again if the player position was found.
        if(playerLocation){
          actions.push(this.actions.attack.action.clone(DirectionsUtility.getDirectionFromCoordinates(targetPosition, playerLocation)));
          break;
        }
        
        //Find the player's location, if they are in the neighbors
        for(const neighbor of neighbors){
          if(this.getMap().locations[neighbor.y][neighbor.x].entity?.id === this.playerId){
            playerLocation = neighbor;
            actions.push(this.actions.attack.action.clone(DirectionsUtility.getDirectionFromCoordinates(targetPosition, playerLocation)));
            break;
          }
        }  
      }
    }

    return actions;
  }
}

class RustedBruteAI implements AIHandler{
  entity: CombatEntity;
  playerPosition: Vector2;
  playerId: number;
  getMap: () => CombatMapData;
  actions: {move: CombatActionWithUses, attack: CombatActionWithUses};

  constructor(entity: CombatEntity, playerPosition: Vector2, playerId: number, getMap: () => CombatMapData, actions: {move: CombatActionWithUses, attack: CombatActionWithUses}){
    this.entity = entity;
    this.playerPosition = playerPosition;
    this.playerId = playerId;
    this.getMap = getMap;
    this.actions = actions;
  }

  handleAI():CombatAction[]{
    const actions:CombatAction[] = [];
    const directions = PathfindingUtil.findPath(this.entity.position, this.playerPosition, this.getMap(), PathfindingAttitude.AGGRESSIVE);

    //Handle movement actions.
    const loopLimit = Math.min(directions.length, this.actions.move.uses);
    for(let i = 0; i < loopLimit; i++){
      actions.push(this.actions.move.action.clone(directions[i]));
    }

    //Handle attack actions.
    const targetPosition = directions.length != 0 ? PathfindingUtil.findStoppingPoint(this.entity.position, directions, this.actions.move.uses) : this.entity.position;
    if(targetPosition){
      const neighbors:Vector2[] = DirectionsUtility.getNeighbors(targetPosition, this.getMap());
      let playerLocation:Vector2|null = null;
      
      for(let i = 0; i < this.actions.attack.uses; i++){
        //Don't go through the inner loop again if the player position was found.
        if(playerLocation){
          actions.push(this.actions.attack.action.clone(DirectionsUtility.getDirectionFromCoordinates(targetPosition, playerLocation)));
          break;
        }
        
        //Find the player's location, if they are in the neighbors
        for(const neighbor of neighbors){
          if(this.getMap().locations[neighbor.y][neighbor.x].entity?.id === this.playerId){
            playerLocation = neighbor;
            actions.push(this.actions.attack.action.clone(DirectionsUtility.getDirectionFromCoordinates(targetPosition, playerLocation)));
            break;
          }
        }  
      }
    }

    return actions;
  }
}

export default CombatEnemy;
export { RustedShambler, RustedBrute  };
export type { AIHandler, KeyActionPairs };