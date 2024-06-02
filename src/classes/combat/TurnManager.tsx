import CombatEntity from "./CombatEntity";
import TurnTaker from "./TurnTaker";

class TurnManager{
    currentTurnTaker: TurnTaker|null;
    advanceTurn: () => void;

    //TurnTaker needs to be "activated" by calling setTurnTakers
    finishSetup: (turnTakers: TurnTaker[]) => void;

    constructor(currentTurnTaker: TurnTaker|null, advanceTurn: () => void, finishSetup: (turnTakers: TurnTaker[]) => void){
        this.currentTurnTaker = currentTurnTaker;
        this.advanceTurn = advanceTurn;
        this.finishSetup = finishSetup;
    }
};

export default TurnManager;