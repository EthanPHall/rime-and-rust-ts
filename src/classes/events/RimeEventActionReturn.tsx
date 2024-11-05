import IRimeEventAction from "./IRimeEventAction";

class RimeEventActionReturn implements IRimeEventAction {
    private returnToCaravan:() =>void;

    constructor(returnToCaravan:() =>void){
        this.returnToCaravan = returnToCaravan;
    }
    
    execute(): void {
        this.returnToCaravan();
    }

    getName(): string {
        return "Return";
    }

    getRequisiteItems(): string[] {
        return [];
    }
}

export default RimeEventActionReturn;