import CombatAction from "../CombatAction";
import CombatEntity from "../CombatEntity";
import Reaction from "./Reaction";
import ReactionFlagAndTriggerList from "./ReactionFlagAndTriggerList";

interface IReactionGenerator{
  getReaction(reactorId:number, reactionTriggerList: ReactionFlagAndTriggerList, reaction:CombatAction): Reaction | null;
}

export default IReactionGenerator;