import ICombatEncounter from "../combat/ICombatEncounter";
import IRimeEventAction from "./IRimeEventAction";

class RimeEventActionAscendGoto implements IRimeEventAction {
    private setSceneId:(newId:number)=>void;
    private idToSetItTo:number;

    constructor(setSceneId:(newId:number)=>void, idToSetItTo:number){
        this.setSceneId = setSceneId;
        this.idToSetItTo = idToSetItTo;
    }

    execute(): void {
        this.setSceneId(this.idToSetItTo);
    }

    getName(): string {
        return "Ascend";
    }

    getRequisiteItems(): string[] {
        return [
            "Grappling Hook"
        ];
    }
}

export default RimeEventActionAscendGoto;