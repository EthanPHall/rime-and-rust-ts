import ICombatEncounter from "../combat/ICombatEncounter";
import IRimeEventAction from "./IRimeEventAction";

class RimeEventActionStartCombat implements IRimeEventAction {
    private setCombatEncounterKey:(newEncounterKey:string) => void;
    private combatEncounterKey:string;

    constructor(setCombatEncounterKey:(newEncounterKey:string) => void, combatEncounterKey:string){
        this.setCombatEncounterKey = setCombatEncounterKey;
        this.combatEncounterKey = combatEncounterKey;
    }

    execute(): void {
        this.setCombatEncounterKey(this.combatEncounterKey);
    }

    getName(): string {
        return "Engage";
    }

    getRequisiteItems(): string[] {
        return [];
    }
}

export default RimeEventActionStartCombat;