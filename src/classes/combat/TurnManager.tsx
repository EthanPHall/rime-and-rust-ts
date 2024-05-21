import CombatEntity from "./CombatEntity";
import TurnTaker from "./TurnTaker";

class TurnManager{
    currentTurnTaker: TurnTaker;
    advanceTurn: () => void;

    constructor(currentTurnTaker: TurnTaker, advanceTurn: () => void){
        this.currentTurnTaker = currentTurnTaker;
        this.advanceTurn = advanceTurn;
    }
};

export default TurnManager;