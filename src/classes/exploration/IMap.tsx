import Vector2 from "../utility/Vector2";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import RimeEventJSON from "../events/RimeEvent";

interface IMap{
    get2DRepresentation(): IMapLocationVisual[][];
    getLocationData(position:Vector2): MapLocationData;
    clone(): IMap;
    setCleared(position:Vector2): void;
    setRevealed(position:Vector2): void;
    setFloating(position:Vector2): void;
    getDimensions(): Vector2;
    getCenterPoint():Vector2;
    getEventToStart(position:Vector2):RimeEventJSON|null;
}

export default IMap;