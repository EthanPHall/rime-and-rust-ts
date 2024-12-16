import ICondition from "./ICondition";

class ConditionGrappled implements ICondition{
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

        if(result){
            console.log("ConditionGrappled wore off");
        }

        return result;
    }
    shouldWearOff(): boolean {
        return this.turnsUntilWearsOff <= 0;
    }
    executeCondition(): void {
        console.log("ConditionGrappled executed");
    }
}

export default ConditionGrappled;