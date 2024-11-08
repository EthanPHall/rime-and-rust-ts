import CombatAction from "./CombatAction";

interface AIHandler{
    handleAI: () => CombatAction[];
}

export default AIHandler;