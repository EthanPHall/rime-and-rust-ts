import { DirectionsUtility } from "../../utility/Directions";
import CombatAction from "../CombatAction";
import { KeyActionPairs } from "../CombatEnemy";
import CombatEntity from "../CombatEntity";
import IReactionGenerator from "./IReactionGenerator";
import Reaction from "./Reaction";
import ReactionFlagAndTriggerList from "./ReactionFlagAndTriggerList";
import ReactionFlags from "./ReactionFlags";

class AttackWhenAttacked implements IReactionGenerator{
    getReaction(reactorId:number, reactionTriggerList: ReactionFlagAndTriggerList, reaction:CombatAction): Reaction | null {
        const triggeringAction:CombatAction|undefined = reactionTriggerList[ReactionFlags.WAS_ATTACKED]?.action;

        if(triggeringAction){
            return new Reaction(reaction.clone(DirectionsUtility.getOppositeDirection(triggeringAction.direction)), 100);
        }

        return null;
    }
}

export default AttackWhenAttacked;