import { UniqueItemQuantitiesList } from "../caravan/Item";
import IRimeEventAction from "./IRimeEventAction";
import IRimeEventScene from "./IRimeEventScene";

class RimeEventSceneRewards implements IRimeEventScene{

    private key:number;
    private type:string;
    private text:string;
    private options:IRimeEventAction[];
    private rewards:UniqueItemQuantitiesList;

    constructor(
        key:number,
        type:string,
        text:string,
        options:IRimeEventAction[],
        rewards:UniqueItemQuantitiesList
    ){
        this.key = key;
        this.type = type;
        this.text = text;
        this.options = options;
        this.rewards = rewards;
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

    getRewards(): UniqueItemQuantitiesList{
        return this.rewards;
    }
    setRewards(newRewards:UniqueItemQuantitiesList):void{
        this.rewards = newRewards;
    }
}

export default RimeEventSceneRewards;