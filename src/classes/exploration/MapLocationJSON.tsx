import Vector2 from "../utility/Vector2";
import IMapLocation from "./IMapLocation";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import MapLocationVisualJSON from "./MapLocationVisualJSON";

class MapLocationJSON implements IMapLocation{
    private position: Vector2;
    private name: string;
    private key: string;
    private cleared: boolean;
    private revealed: boolean;
    private floating: boolean;

    constructor(
        position: Vector2,
        name: string,
        key: string,
        cleared: boolean,
        revealed: boolean,
        floating: boolean
    ){
        this.position = position;
        this.name = name;
        this.key = key;
        this.cleared = cleared;
        this.revealed = revealed;
        this.floating = floating;
    }

    getVisual(): IMapLocationVisual {
        return new MapLocationVisualJSON(this.getData());
    }
    getIsCleared(): boolean {
        return this.cleared;
    }
    getIsRevealed(): boolean {
        return this.revealed;
    }
    getIsFloating(): boolean {
        return this.floating;
    }
    getPostition(): Vector2 {
        return new Vector2(this.position.x, this.position.y);
    }
    setCleared(): void {
        this.cleared = true;
    }
    setRevealed(): void {
        this.revealed = true;
    }
    setFloating(): void {
        this.floating = true;
    }
    setPosition(position: Vector2): void {
        this.position = position;
    }
    getData(): MapLocationData {
        return new MapLocationData(this.position, this.name, this.key, this.cleared, this.revealed, this.floating);
    }
    getName(): string {
        return this.name;
    }
    getKey(): string {
        return this.key;
    }
}

export default MapLocationJSON;