import CombatEntity from "./CombatEntity";

interface TurnTaker{
    combatEntity: CombatEntity;
    
    startTurn(): void;
    endTurn(): void;
    advanceTurn: () => void;
}

export default TurnTaker;