import CombatEntity from "./CombatEntity";

interface TurnTaker{
    combatEntity: CombatEntity;
    
    startTurn(): void;
    endTurn(): void;
    advanceTurn: () => void;
    canTakeTurn(): boolean;
}

function isTurnTaker(arg: any): arg is TurnTaker{
    return arg.combatEntity !== undefined && arg.startTurn !== undefined && arg.endTurn !== undefined && arg.advanceTurn !== undefined && arg.canTakeTurn !== undefined;
}

export default TurnTaker;
export {isTurnTaker};