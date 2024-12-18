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

class FollowSourceMovement implements IReactionGenerator{
    private sourceId: number;
    constructor(sourceId: number){
        this.sourceId = sourceId;
    }

    getReaction(reactorId:number, getMap: ()=>CombatMapData, reactionTriggerList: ReactionFlagAndTriggerList|undefined): Reaction | null {
        const trigger:ActionWhoDidAction|undefined = CombatEntity.getEntityWideTrigger(ReactionFlags.ENTITY_DID_MOVE);
        const triggeringEntity:CombatEntity|null = trigger ? getMap().getEntityById(trigger.whoDidActionId) : null;
        const triggeringAction:CombatAction|undefined = trigger?.action;

        const reactor:CombatEntity|null = getMap().getEntityById(reactorId);

        console.log("FollowSourceMovement");

        if(triggeringEntity && reactor && trigger?.whoDidActionId === this.sourceId && triggeringAction){
            //We want to move the reactor into the previous position of the source entity.

            //We need to get the direction of the source's movement so that we can figure out what their previous postion was.
            const oppositeSourceMovementDirection = DirectionsUtility.getOppositeDirection(triggeringAction.direction);
            const previousPosition: Vector2 = triggeringEntity.position.add(DirectionsUtility.getVectorFromDirection(oppositeSourceMovementDirection));

            //Now we need to find the direction of the reactor to the previous position of the source entity.
            const directionToPreviousPosition = DirectionsUtility.getDirectionFromVector(previousPosition.subtract(reactor.position));

            //Now we return a reaction that has a Move actions with the direction that the reactor needs to move in.
            const moveAction:CombatAction|null = reactor.getMoveAction();
            if(moveAction){
                return new Reaction(moveAction.clone(directionToPreviousPosition), 100);
            }
        }

        return null;
    }
}

export default FollowSourceMovement;