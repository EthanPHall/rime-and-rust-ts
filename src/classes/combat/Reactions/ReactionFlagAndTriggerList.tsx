import CombatAction from "../CombatAction";
import CombatEntity from "../CombatEntity";
import ReactionFlags from "./ReactionFlags";

type ReactionFlagAndTriggerList = { [ k in ReactionFlags ]?: {action: CombatAction, whoDidActionId: number} };

export default ReactionFlagAndTriggerList;