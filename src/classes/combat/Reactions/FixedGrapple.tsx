import { DirectionsUtility } from "../../utility/Directions";
import Vector2 from "../../utility/Vector2";
import CombatAction, { Move } from "../CombatAction";
import CombatActionFactory from "../CombatActionFactory";
import CombatEntity from "../CombatEntity";
import CombatMapData from "../CombatMapData";
import IReactionGenerator from "./IReactionGenerator";
import Reaction from "./Reaction";
import ReactionFlagAndTriggerList, { ActionWhoDidAction } from "./ReactionFlagAndTriggerList";
import ReactionFlags from "./ReactionFlags";

class FixedGrappleReaction implements IReactionGenerator{
    private sourceId: number;
    constructor(sourceId: number){
        this.sourceId = sourceId;
    }

    getReaction(reactorId:number, getMap: ()=>CombatMapData, reactionTriggerList: ReactionFlagAndTriggerList|undefined): Reaction | null {
        const trigger:ActionWhoDidAction|undefined = CombatEntity.getEntityWideTrigger(ReactionFlags.ENTITY_DID_MOVE);
        const triggeringEntity:CombatEntity|null = trigger ? getMap().getEntityById(trigger.whoDidActionId) : null;
        const triggeringAction:CombatAction|undefined = trigger?.action;

        const reactor:CombatEntity|null = getMap().getEntityById(reactorId);

        if(triggeringEntity && reactor && trigger?.whoDidActionId === this.sourceId && triggeringAction){
            //We want to move the reactor in the same direction the source entity moved in.

            //Now we return a reaction that has a Move actions with the direction that the reactor needs to move in.
            const moveAction:CombatAction|null = reactor.getMoveAction();
            if(moveAction){
                return new Reaction(moveAction.clone(triggeringAction.direction), 100);
            }
        }

        return null;
    }
}

export default FixedGrappleReaction;