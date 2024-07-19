import Vector2 from "../utility/Vector2";
import IMapLocation from "./IMapLocation";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";

class MapLocationJSON implements IMapLocation{
    getVisual(): IMapLocationVisual {
        throw new Error("Method not implemented.");
    }
    getIsCleared(): boolean {
        throw new Error("Method not implemented.");
    }
    getIsRevealed(): boolean {
        throw new Error("Method not implemented.");
    }
    getIsFloating(): boolean {
        throw new Error("Method not implemented.");
    }
    getPostition(): Vector2 {
        throw new Error("Method not implemented.");
    }
    setCleared(): void {
        throw new Error("Method not implemented.");
    }
    setRevealed(): void {
        throw new Error("Method not implemented.");
    }
    setFloating(): void {
        throw new Error("Method not implemented.");
    }
    setPosition(position: Vector2): void {
        throw new Error("Method not implemented.");
    }
    getData(): MapLocationData {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        throw new Error("Method not implemented.");
    }
    getKey(): string {
        throw new Error("Method not implemented.");
    }
}

export default MapLocationJSON;