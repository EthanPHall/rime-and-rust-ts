import CombatEntity from "../CombatEntity";
import FollowSourceMovement from "../Reactions/FollowSourceMovement";
import ReactionFlags from "../Reactions/ReactionFlags";
import ICondition from "./ICondition";

class ConditionGrappled implements ICondition{
    private turnsUntilWearsOff: number;
    private applyerId: number;

    constructor(applyerId: number, turnsUntilWearsOff: number = 99){
        this.turnsUntilWearsOff = turnsUntilWearsOff;
        this.applyerId = applyerId;
    }
    
    getTurnsUntilWearsOff(): number {
        return this.turnsUntilWearsOff;
    }

    evaluateShouldWearOff(affected:CombatEntity): boolean {
        if(
            affected.getReactionFlag(ReactionFlags.BUMPED_ON_SOLID_SURFACE) ||
            affected.getReactionFlag(ReactionFlags.WAS_PUSHED)
        ){
            this.turnsUntilWearsOff = 0;
        }

        const result:boolean = this.shouldWearOff(affected);
        this.turnsUntilWearsOff--;
        return result;
    }
    shouldWearOff(affected:CombatEntity): boolean {
        if(
            affected.getReactionFlag(ReactionFlags.BUMPED_ON_SOLID_SURFACE) ||
            affected.getReactionFlag(ReactionFlags.WAS_PUSHED)
        ){
            this.turnsUntilWearsOff = 0;
        }

        return this.turnsUntilWearsOff <= 0;
    }
    executeCondition(affected:CombatEntity): void {
        if(
            affected.getReactionFlag(ReactionFlags.BUMPED_ON_SOLID_SURFACE) ||
            affected.getReactionFlag(ReactionFlags.WAS_PUSHED)
        ){
            this.turnsUntilWearsOff = 0;
            return;
        }

        affected.addReactionGenerator(new FollowSourceMovement(this.applyerId));
        affected.setWorkingSpeed(0);
    }
}

export default ConditionGrappled;