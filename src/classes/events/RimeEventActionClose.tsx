import IRimeEventAction from "./IRimeEventAction";

class RimeEventActionClose implements IRimeEventAction {
    private closeEventScreen:() =>void;

    constructor(closeEventScreen:() =>void){
        this.closeEventScreen = closeEventScreen;
    }
    
    execute(): void {
        this.closeEventScreen();
    }

    getName(): string {
        return "Close";
    }

    getRequisiteItems(): string[] {
        return [];
    }
}

export default RimeEventActionClose;