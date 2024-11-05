import IRimeEventAction from "./IRimeEventAction";
import RimeEventActionClose from "./RimeEventActionClose";

class RimeEventActionCloseAndClear implements IRimeEventAction {
    private clearEventLocation:()=>void;

    private closeAction:RimeEventActionClose;

    constructor(clearEventLocation:()=>void, closeEventScreen:() =>void){
        this.clearEventLocation = clearEventLocation;
    
        this.closeAction = new RimeEventActionClose(closeEventScreen);
    }

    execute(): void {
        this.clearEventLocation();
        this.closeAction.execute();
    }

    getName(): string {
        return "Close";
    }

    getRequisiteItems(): string[] {
        return [];
    }
}

export default RimeEventActionCloseAndClear;