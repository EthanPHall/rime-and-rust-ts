import { CombatActionWithRepeat } from "./CombatAction";

interface IActionExecutor {
    execute(): void;
    isExecuting(): boolean;
}

export default IActionExecutor;