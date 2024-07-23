import IMapLocationVisual from "./IMapLocationVisual";
import MapLocationData from "./MapLocationData";
import explorationLocationData from "../../data/exploration/exploration-location-data.json";

class MapLocationVisualJSON implements IMapLocationVisual{
    locationData:MapLocationData;
    symbol:string;
    styles:string;

    constructor(locationData:MapLocationData){
        this.locationData = locationData;

        const specificLocationData = explorationLocationData.allKeyVisuals.find(data => data.key === locationData.getKey());
        this.symbol = "";
        this.styles = "";

        if(specificLocationData){
            this.symbol = specificLocationData.visualInfo.symbol;
            this.styles = specificLocationData.visualInfo.styles;
        }
    }

    getSymbol(): string {
        return this.symbol;
    }
    getStyles(): string {
        return this.styles;
    }
}

export default MapLocationVisualJSON;