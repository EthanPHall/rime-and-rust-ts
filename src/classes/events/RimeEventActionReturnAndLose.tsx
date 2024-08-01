import IRimeEventAction from "./IRimeEventAction";
import RimeEventActionReturn from "./RimeEventActionReturn";

class RimeEventActionReturnAndLose implements IRimeEventAction {
    private clearExplorationInventory:()=>void;

    private returnAction:RimeEventActionReturn;

    constructor(clearExplorationInventory:()=>void, returnToCaravan: () => void){
        this.clearExplorationInventory = clearExplorationInventory;
    
        this.returnAction = new RimeEventActionReturn(returnToCaravan);
    }

    execute(): void {
        this.clearExplorationInventory();
        this.returnAction.execute();
    }
}

export default RimeEventActionReturnAndLose;