import Vector2 from "../utility/Vector2";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import RimeEventJSON from "../events/RimeEventJSON";
import ISaveable from "../utility/ISaveable";

interface IMapLocation extends ISaveable {
    getVisual():IMapLocationVisual;
    
    getIsCleared():boolean;
    getIsRevealed():boolean;
    getIsFloating():boolean;
    getPostition():Vector2;

    setCleared():void;
    setRevealed():void;
    setFloating():void;
    setPosition(position:Vector2):void;

    getData():MapLocationData;
    getName():string;
    getKey():string;

    getEventToStart():string|null;
}

export default IMapLocation;