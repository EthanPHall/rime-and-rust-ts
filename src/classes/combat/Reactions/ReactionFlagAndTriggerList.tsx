import CombatAction from "../CombatAction";
import CombatEntity from "../CombatEntity";
import ReactionFlags from "./ReactionFlags";

type ActionWhoDidAction = {action: CombatAction, whoDidActionId: number};
type ReactionFlagAndTriggerList = { [ k in ReactionFlags ]?: ActionWhoDidAction };

export default ReactionFlagAndTriggerList;
export type { ActionWhoDidAction };