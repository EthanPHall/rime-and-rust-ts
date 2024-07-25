import IRimeEventScene from "./IRimeEventScene";

interface IRimeEvent{
    getKey():string;
    getName():string;
    getScenes():IRimeEventScene[];
}

export default IRimeEvent;