import IdGenerator from "../utility/IdGenerator";
import Vector2 from "../utility/Vector2";
import CombatAction from "./CombatAction";
import CombatMapData from "./CombatMapData";
import ICondition from "./Conditions/ICondition";
import AttackWhenAttacked from "./Reactions/AttackWhenAttacked";
import IReactionGenerator from "./Reactions/IReactionGenerator";
import Reaction from "./Reactions/Reaction";
import ReactionFlagAndTriggerList from "./Reactions/ReactionFlagAndTriggerList";
import ReactionFlags from "./Reactions/ReactionFlags";

abstract class CombatEntity{
  protected static ENTITY_WIDE_REACTION_LIST: ReactionFlagAndTriggerList = {};
  static clearEntityWideReactions(): void {
    CombatEntity.ENTITY_WIDE_REACTION_LIST = {};
  }
  static setEntityWideReaction(flag: ReactionFlags, action: CombatAction, whoDidActionId: number): void {
    CombatEntity.ENTITY_WIDE_REACTION_LIST[flag] = {action, whoDidActionId};
  }
    id: number;  
    protected hp: number;
    maxHp: number;
    symbol: string;
    name: string;
    position: Vector2;
    description: string;
    protected reactionTriggerList: ReactionFlagAndTriggerList = {};
    protected conditions: ICondition[];
    protected default_speed: number;
    protected working_speed: number;
    protected default_reactionGenerators: IReactionGenerator[] = [new AttackWhenAttacked()];
    protected working_reactionGenerators: IReactionGenerator[] = [];

    getMap: () => CombatMapData;
  
    constructor(
      id:number, 
      hp:number, 
      maxHp:number, 
      symbol: string, 
      name: string, 
      position: Vector2, 
      getMap: () => CombatMapData,
      description: string = "",
      conditions: ICondition[] = [],
      speed: number = 5,
    ){
      this.id = id;
      this.hp = hp;
      this.maxHp = maxHp;
      this.symbol = symbol;
      this.name = name;
      this.position = position;
      this.description = description;

      this.conditions = conditions;
      this.default_speed = speed;
      this.working_speed = this.default_speed;

      this.getMap = getMap;
    }

    getId(): number{
      return this.id;
    }
    getHp(): number{
      return this.hp;
    }

    abstract clone(): CombatEntity;

    takeDamage(damage:number, damagingAction: CombatAction, whoDidActionId: number): void{
      const previousHp = this.hp;

      this.hp -= damage;

      if(previousHp > 0 && this.hp <= 0){
        this.setReactionFlag(ReactionFlags.DID_DIE, damagingAction, whoDidActionId);
      }
    }
    killEntity(): void{
      this.hp = 0;
    }

    isWalkable(): boolean{
      return false;
    }

    isMovable(): boolean{
      return true;
    }

    getReaction(): Reaction|null {
      return null;
    }
    clearReactionFlags(): void {
      this.reactionTriggerList = {};
    }
    setReactionFlag(flag: ReactionFlags, action: CombatAction, whoDidActionId: number): void {
      this.reactionTriggerList[flag] = {action, whoDidActionId};
    }

    resetToDefaults(): void {
      this.working_reactionGenerators = this.default_reactionGenerators;
      this.working_speed = this.default_speed;
    }

    onDeath(): void{}
  }

export default CombatEntity;