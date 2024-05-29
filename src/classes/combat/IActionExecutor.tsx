import { CombatActionWithRepeat } from "./CombatAction";

interface IActionExecutor {
    execute(actions: CombatActionWithRepeat[]): void;
    isExecuting(): boolean;
}

export default IActionExecutor;