import CombatEnemy from "./CombatEnemy";
import CombatEntity from "./CombatEntity";
import CombatHazard from "./CombatHazard";
import TurnManager from "./TurnManager";
import TurnTaker, { isTurnTaker } from "./TurnTaker";

class EntitySpawner {
    private turnManager: TurnManager;
    private getHazards: () => CombatHazard[];
    private getEnemies: () => CombatEnemy[];
    private setHazards: (newValue: CombatHazard[]) => void;
    private setEnemies: (newValue: CombatEnemy[]) => void;


    constructor(
        turnManager: TurnManager,
        getHazards: () => CombatHazard[],
        getEnemies: () => CombatEnemy[],
        setHazards: (newValue: CombatHazard[]) => void,
        setEnemies: (newValue: CombatEnemy[]) => void
    ) {
        this.turnManager = turnManager;
        this.getHazards = getHazards;
        this.getEnemies = getEnemies;
        this.setHazards = setHazards;
        this.setEnemies = setEnemies;
    }

    spawnEntity(entity: CombatEntity) {
        if (entity instanceof CombatHazard) {
            console.log("Spawning hazard: " + entity);

            const hazard = entity as CombatHazard;
            
            this.getHazards().push(hazard);
            this.setHazards(this.getHazards());

            if(isTurnTaker(hazard)){
                this.turnManager.addNewTurnTaker(hazard as unknown as TurnTaker);
            }
        } else if (entity instanceof CombatEnemy) {
            this.getEnemies().push(entity);
            this.setEnemies(this.getEnemies());

            this.turnManager.addNewTurnTaker(entity);
        } else {
            throw new Error("Invalid entity type: " + entity);
        }
    }
}

export default EntitySpawner;