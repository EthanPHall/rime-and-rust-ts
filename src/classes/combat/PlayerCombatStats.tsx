type PlayerCombatStatMod = {
    statName: string;
    mod: number;
}

class PlayerCombatStats {
    private baseHealth: number;
    private baseSpeed: number;
    private statMods: PlayerCombatStatMod[];

    constructor(baseHealth: number = 10, baseSpeed: number = 5, initialStatMods: PlayerCombatStatMod[] = []){ 
        this.baseHealth = baseHealth;
        this.baseSpeed = baseSpeed;
        this.statMods = initialStatMods;
    }

    private getStatModTotal(statName: string): number {
        return this.statMods.filter((mod) => mod.statName === statName).reduce((acc, mod) => acc + mod.mod, 0);
    }

    getHealth(): number {
        return this.baseHealth + this.getStatModTotal("health");
    }

    getSpeed(): number {
        return this.baseSpeed + this.getStatModTotal("speed");
    }
}

export default PlayerCombatStats;
export type { PlayerCombatStatMod };