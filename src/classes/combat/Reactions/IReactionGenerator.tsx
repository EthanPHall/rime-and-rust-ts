import CombatAction from "../CombatAction";
import CombatActionFactory from "../CombatActionFactory";
import CombatEntity from "../CombatEntity";
import CombatMapData from "../CombatMapData";
import Reaction from "./Reaction";
import ReactionFlagAndTriggerList from "./ReactionFlagAndTriggerList";

interface IReactionGenerator{
  getReaction(reactorId:number, getMap: ()=>CombatMapData, reactionTriggerList: ReactionFlagAndTriggerList|undefined): Reaction | null;
}

export default IReactionGenerator;