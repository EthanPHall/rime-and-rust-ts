import { TargetAndTransition } from "framer-motion";

interface IMapLocationVisual{
    getSymbol():string;
    getStyles():string;
    getAnimation():TargetAndTransition|undefined;
    getRevealed():boolean;
}

export default IMapLocationVisual;   