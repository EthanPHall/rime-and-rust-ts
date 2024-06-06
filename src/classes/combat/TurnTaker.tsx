import CombatEntity from "./CombatEntity";

interface TurnTaker{
    combatEntity: CombatEntity;
    
    startTurn(): void;
    endTurn(): void;
    advanceTurn: () => void;
    canTakeTurn(): boolean;
}

export default TurnTaker;