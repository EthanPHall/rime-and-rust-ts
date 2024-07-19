import IMapLocationVisual from "./IMapLocationVisual";
import MapLocationData from "./MapLocationData";

class MapLocationVisualJSON implements IMapLocationVisual{
    locationData:MapLocationData;
    symbol:string;
    styles:string;

    constructor(locationData:MapLocationData){
        this.locationData = locationData;
        this.symbol = "";
        this.styles = "";
    }

    getSymbol(): string {
        throw new Error("Method not implemented.");
    }
    getStyles(): string {
        throw new Error("Method not implemented.");
    }
}

export default MapLocationVisualJSON;