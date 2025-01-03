import CombatAction from "../CombatAction";
import { KeyActionPairs } from "../CombatEnemy";
import CombatMapData from "../CombatMapData";
import IReactionGenerator from "./IReactionGenerator";
import Reaction from "./Reaction";
import ReactionFlagAndTriggerList from "./ReactionFlagAndTriggerList";
import ReactionFlags from "./ReactionFlags";

class AttackWhenBump implements IReactionGenerator{
    actions: KeyActionPairs;
  
    constructor(actions: KeyActionPairs){
      this.actions = actions;
    }
  
    getReaction(
      reactorId:number, 
      getMap: ()=>CombatMapData, 
      reactionTriggerList: ReactionFlagAndTriggerList|undefined, 
      reactionToTake?:CombatAction
    ): Reaction | null {
      const triggeringAction:CombatAction|undefined = reactionTriggerList ? reactionTriggerList[ReactionFlags.BUMPED_ON_SOLID_SURFACE]?.action : undefined;

      if(triggeringAction){
        const reactionAction = reactionToTake ? reactionToTake.clone(triggeringAction.direction) : this.actions.attack.action.clone(triggeringAction.direction);

        return new Reaction(reactionAction, 100);
      }
  
      return null;
    }
  }

export default AttackWhenBump;