import CombatEntity from "../CombatEntity";
import FollowSourceMovement from "../Reactions/FollowSourceMovement";
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

    evaluateShouldWearOff(): boolean {
        

        const result:boolean = this.shouldWearOff();
        this.turnsUntilWearsOff--;
        return result;
    }
    shouldWearOff(): boolean {
        return this.turnsUntilWearsOff <= 0;
    }
    executeCondition(affected:CombatEntity): void {
        affected.addReactionGenerator(new FollowSourceMovement(this.applyerId));
        affected.setWorkingSpeed(0);
    }
}

export default ConditionGrappled;