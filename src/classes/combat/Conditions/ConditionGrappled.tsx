import CombatEntity from "../CombatEntity";
import FixedGrappleReaction from "../Reactions/FixedGrapple";
import FollowSourceMovement from "../Reactions/FollowSourceMovement";
import ReactionFlags from "../Reactions/ReactionFlags";
import ConditionName from "./ConditionNames";
import ICondition from "./ICondition";

enum GrappleModes{
    Pull = "Pull",
    Fixed = "Fixed",
}

class ConditionGrappled implements ICondition{
    private turnsUntilWearsOff: number;
    private affectedId: number;
    private applyerId: number;
    private mode: GrappleModes = GrappleModes.Pull;

    constructor(affectedId: number, applyerId: number, turnsUntilWearsOff: number = 99){
        this.turnsUntilWearsOff = turnsUntilWearsOff;
        this.applyerId = applyerId;
        this.affectedId = affectedId;
    }
    
    getTurnsUntilWearsOff(): number {
        return this.turnsUntilWearsOff;
    }

    getApplyerId(): number {
        return this.applyerId;
    }

    getAffectedId(): number {
        return this.affectedId;
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

        if(this.mode === GrappleModes.Pull){
            affected.addReactionGenerator(new FollowSourceMovement(this.applyerId));
        }
        else if(this.mode === GrappleModes.Fixed){
            affected.addReactionGenerator(new FixedGrappleReaction(this.applyerId));
        }

        affected.setWorkingSpeed(0);
    }
    getName():ConditionName {
        return ConditionName.Grappled;
    }
    getMode(): string {
        return this.mode;
    }
    switchMode(): void {
        if(this.mode === GrappleModes.Pull){
            this.mode = GrappleModes.Fixed;
        }else{
            this.mode = GrappleModes.Pull;
        }
    }
}

export default ConditionGrappled;
export {GrappleModes};