import IRimeEventAction from "./IRimeEventAction";
import IRimeEventScene from "./IRimeEventScene";

class RimeEventSceneTextOnly implements IRimeEventScene{

    private key:number;
    private type:string;
    private text:string;
    private options:IRimeEventAction[];

    constructor(
        key:number,
        type:string,
        text:string,
        options:IRimeEventAction[],
    ){
        this.key = key;
        this.type = type;
        this.text = text;
        this.options = options;
    }

    getKey(): number {
        return this.key;
    }
    getType(): string {
        return this.type;
    }
    getText(): string {
        return this.text;
    }
    getOptions(): IRimeEventAction[] {
        return this.options;
    }
    executOption(option: IRimeEventAction): void {
        throw new Error("Method not implemented.");
    }
}

export default RimeEventSceneTextOnly;