import Vector2 from "../utility/Vector2";
import IMapLocation from "./IMapLocation";

class MapLocationData{
    private position: Vector2;
    private key: string;
    private name: string;
    private cleared: boolean;
    private revealed: boolean;
    private floating: boolean;

    constructor(
        position: Vector2,
        key: string,
        name: string,
        cleared: boolean,
        revealed: boolean,
        floating: boolean
    ){
        this.position = new Vector2(position.x, position.y);
        this.name = name;
        this.key = key;
        this.cleared = cleared;
        this.revealed = revealed;
        this.floating = floating;
    }

    getCleared(): boolean {
        return this.cleared;
    }
    getRevealed(): boolean {
        return this.revealed;
    }
    getFloating(): boolean {
        return this.floating;
    }
    getPosition(): Vector2 {
        return this.position;
    }
    getName(): string {
        return this.name;
    }
    getKey(): string {
        return this.key;
    }
}

export default MapLocationData;