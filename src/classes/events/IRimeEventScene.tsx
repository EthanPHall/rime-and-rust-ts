import IRimeEventAction from "./IRimeEventAction";

interface IRimeEventScene{
    getKey():number;
    getType():string;
    getText():string;
    getOptions():IRimeEventAction[];
    executOption(option:IRimeEventAction):void;
}

export default IRimeEventScene;