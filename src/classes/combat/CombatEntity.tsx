import IdGenerator from "../utility/IdGenerator";
import Vector2 from "../utility/Vector2";
import CombatAction from "./CombatAction";
import { Reaction, ReactionFlagAndTriggerList, ReactionFlags } from "./CombatEnemy";

abstract class CombatEntity{
  protected static ENTITY_WIDE_REACTION_LIST: ReactionFlagAndTriggerList = {};
  static clearEntityWideReactions(): void {
    CombatEntity.ENTITY_WIDE_REACTION_LIST = {};
  }
  static setEntityWideReaction(flag: ReactionFlags, action: CombatAction): void {
    CombatEntity.ENTITY_WIDE_REACTION_LIST[flag] = action;
  }


    id: number;  
    protected hp: number;
    maxHp: number;
    symbol: string;
    name: string;
    position: Vector2;
    description: string;
    protected reactionTriggerList: ReactionFlagAndTriggerList = {};
  
    constructor(id: number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, description: string = ""){
      this.id = id;
      this.hp = hp;
      this.maxHp = maxHp;
      this.symbol = symbol;
      this.name = name;
      this.position = position;
      this.description = description;
    }

    // -------------- Getters -------------- //
    getId(): number{
      return this.id;
    }
    getHp(): number{
      return this.hp;
    }

    abstract clone(): CombatEntity;

    takeDamage(damage:number, damagingAction: CombatAction): void{
      const previousHp = this.hp;

      this.hp -= damage;

      if(previousHp > 0 && this.hp <= 0){
        this.setReactionFlag(ReactionFlags.DID_DIE, damagingAction);
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
    setReactionFlag(flag: ReactionFlags, action: CombatAction): void {
      this.reactionTriggerList[flag] = action;
    }

    onDeath(): void{}
  }

export default CombatEntity;