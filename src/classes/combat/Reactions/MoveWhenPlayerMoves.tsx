import CombatAction from "../CombatAction";
import { KeyActionPairs } from "../CombatEnemy";
import IReactionGenerator from "./IReactionGenerator";
import Reaction from "./Reaction";
import ReactionFlagAndTriggerList from "./ReactionFlagAndTriggerList";
import ReactionFlags from "./ReactionFlags";

class MoveWhenPlayerMoves implements IReactionGenerator{
    reactionTriggerList: ReactionFlagAndTriggerList;
    actions: KeyActionPairs;
  
    constructor(actions: KeyActionPairs, reactionTriggerList: ReactionFlagAndTriggerList){
      this.reactionTriggerList = reactionTriggerList;
      this.actions = actions;
    }
  
    getReaction(): Reaction | null {
      const triggeringAction:CombatAction|undefined = this.reactionTriggerList[ReactionFlags.PLAYER_DID_MOVE]?.action;
        
      if(triggeringAction){
        return new Reaction(this.actions.move.action.clone(triggeringAction.direction), 100);
      }
  
      return null;
    }
  }

export default MoveWhenPlayerMoves;