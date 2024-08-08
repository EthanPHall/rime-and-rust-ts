import Vector2 from "../utility/Vector2";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import RimeEventJSON from "../events/RimeEventJSON";
import IMapLocation from "./IMapLocation";
import { SaveObject } from "../../context/misc/SettingsContext";
import ISaveable from "../utility/ISaveable";

interface IMap extends ISaveable{
    get2DRepresentation(): IMapLocationVisual[][];
    getLocationData(position:Vector2): MapLocationData;
    getLocation(position:Vector2):IMapLocation;
    clone(): IMap;
    setCleared(position:Vector2): void;
    setRevealed(position:Vector2): void;
    setFloating(position:Vector2): void;
    getDimensions(): Vector2;
    getCenterPoint():Vector2;
    getEventToStart(position:Vector2):string|null;
}

export default IMap;