import IRimeEventAction from "./IRimeEventAction";
import IRimeEventScene from "./IRimeEventScene";

class RimeEventSceneRewards implements IRimeEventScene{
    getKey(): number {
        throw new Error("Method not implemented.");
    }
    getType(): string {
        throw new Error("Method not implemented.");
    }
    getText(): string {
        throw new Error("Method not implemented.");
    }
    getOptions(): IRimeEventAction[] {
        throw new Error("Method not implemented.");
    }
    executOption(option: IRimeEventAction): void {
        throw new Error("Method not implemented.");
    }

}

export default RimeEventSceneRewards;