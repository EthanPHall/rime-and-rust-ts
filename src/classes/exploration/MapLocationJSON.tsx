import Vector2 from "../utility/Vector2";
import IMapLocation from "./IMapLocation";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import MapLocationVisualJSON from "./MapLocationVisualJSON";
import RimeEventJSON from "../events/RimeEventJSON";
import locationData from "../../data/exploration/exploration-location-data.json"
import ISaveable from "../utility/ISaveable";

class MapLocationJSON implements IMapLocation{
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
        this.position = position;
        this.key = key;
        this.name = name;
        this.cleared = cleared;
        this.revealed = revealed;
        this.floating = floating;
    }
    getEventToStart(): string | null {
        if(this.cleared){
            return null;
        }
        
        const event = locationData.groundedEventsByKey.find((keyEvent) => {
            return keyEvent.key == this.key;
        })
        
        if(!event){
            return null;
        }
        
        const chance = Math.random() * 100;
        let accumulator = 0;
        for(let i = 0; i < event.eventKeyChancePairs.length; i++){
            const currentPair = event.eventKeyChancePairs[i];
            accumulator += currentPair.chance;
            if(chance < accumulator){
                return currentPair.eventKey;
            }
        }
        
        return null;
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
        return new MapLocationData(this.position, this.key, this.name, this.cleared, this.revealed, this.floating);
    }
    getName(): string {
        return this.name;
    }
    getKey(): string {
        return this.key;
    }
    
    /*
    private position: Vector2;
    private key: string;
    private name: string;
    private cleared: boolean;
    private revealed: boolean;
    private floating: boolean;
    */
   createSaveObject():any{
       return{
           positionData: {
               x:this.position.x,
               y:this.position.y
            },
            keyData: this.key,
            nameData: this.name,
            clearedData: this.cleared,
            revealedData: this.revealed,
            floatingData: this.floating,
        }
    }
    loadSaveObject(locationData:any):void{
        const positionData = locationData.positionData;
        const keyData = locationData.keyData;
        const nameData = locationData.nameData;
        const clearedData = locationData.clearedData;
        const revealedData = locationData.revealedData;
        const floatingData = locationData.floatingData;

        this.position = new Vector2(positionData.x,positionData.y);
        this.key = keyData;
        this.name = nameData;
        this.cleared = clearedData;
        this.revealed = revealedData;
        this.floating = floatingData;
    }
}

export default MapLocationJSON;