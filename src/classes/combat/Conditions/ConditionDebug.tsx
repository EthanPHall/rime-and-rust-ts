import CombatEntity from "../CombatEntity";
import ICondition from "./ICondition";

class ConditionDebug implements ICondition{
    private turnsUntilWearsOff: number = 1;
    constructor(turnsUntilWearsOff: number){
        this.turnsUntilWearsOff = turnsUntilWearsOff;
    }
    
    getTurnsUntilWearsOff(): number {
        return this.turnsUntilWearsOff;
    }

    evaluateShouldWearOff(): boolean {
        const result:boolean = this.turnsUntilWearsOff <= 0;
        this.turnsUntilWearsOff--;
        return result;
    }
    shouldWearOff(): boolean {
        return this.turnsUntilWearsOff <= 0;
    }
    executeCondition(affected: CombatEntity): void {
        console.log("ConditionDebug executed");
    }
}

export default ConditionDebug;