import IRimeEventAction from "./IRimeEventAction";
import RimeEventActionClose from "./RimeEventActionClose";

class RimeEventActionCloseAndModifyWorkers implements IRimeEventAction {
    private modifyWorkers:(amount:number)=>void;
    private amount:number;
    private closeAction:RimeEventActionClose;

    constructor(modifyWorkers:(amount:number)=>void, amount:number, closeEventScreen:() =>void){
        this.modifyWorkers = modifyWorkers;
        this.amount = amount;
    
        this.closeAction = new RimeEventActionClose(closeEventScreen);
    }

    execute(): void {
        this.modifyWorkers(this.amount);
        this.closeAction.execute();
    }

    getName(): string {
        return "Close";
    }

    getRequisiteItems(): string[] {
        return [];
    }
}

export default RimeEventActionCloseAndModifyWorkers;