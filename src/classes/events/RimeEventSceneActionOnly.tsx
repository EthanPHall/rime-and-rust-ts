import IRimeEventAction from "./IRimeEventAction";
import IRimeEventScene from "./IRimeEventScene";

class RimeEventSceneActionOnly implements IRimeEventScene{

    private key:number;
    private type:string;
    private options:IRimeEventAction[];

    constructor(
        key:number,
        type:string,
        options:IRimeEventAction[],
    ){
        this.key = key;
        this.type = type;
        this.options = options;
    }

    getKey(): number {
        return this.key;
    }
    getType(): string {
        return this.type;
    }
    getText(): string {
        return "Action only, you shouldn't be seeing this";
    }
    getOptions(): IRimeEventAction[] {
        return this.options;
    }
    executOption(option: IRimeEventAction): void {
        this.options[0].execute();
    }
}

export default RimeEventSceneActionOnly;