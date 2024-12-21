import CombatEntity from "../CombatEntity";
import ConditionName from "./ConditionNames";
import ICondition from "./ICondition";

enum DebugModes{
    Debug = "Debug",
}

class ConditionDebug implements ICondition{
    private turnsUntilWearsOff: number;
    private affectedId: number;
    private applyerId: number;

    constructor(affectedId:number, applyerId: number, turnsUntilWearsOff: number = 99){
        this.turnsUntilWearsOff = turnsUntilWearsOff;
        this.applyerId = applyerId;
        this.affectedId = affectedId;
    }
    
    getApplyerId(): number {
        return this.applyerId;
    }

    getAffectedId(): number {
        return this.affectedId;
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
    getName(): ConditionName {
        return ConditionName.Debug;
    }
    getMode(): string {
        return DebugModes.Debug;
    }
    switchMode(): void {
        return;
    }
}

export default ConditionDebug;
export {DebugModes};