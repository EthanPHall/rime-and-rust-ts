import ICombatEncounter from "./ICombatEncounter";

class CombatEncounterJSON implements ICombatEncounter{
    // private key:string;
    
    // private victoryEventKey:string;
    // private lossEventKey:string;

    getKey(): string {
        throw new Error("Method not implemented.");
    }
    getVictoryEventKey(): string {
        throw new Error("Method not implemented.");
    }
    getLossEventKey(): string {
        throw new Error("Method not implemented.");
    }

}

export default CombatEncounterJSON;