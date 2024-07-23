import IMapLocationVisual from "./IMapLocationVisual";
import MapLocationData from "./MapLocationData";
import explorationLocationData from "../../data/exploration/exploration-location-data.json";
import { TargetAndTransition } from "framer-motion";

class MapLocationVisualJSON implements IMapLocationVisual{
    locationData:MapLocationData;
    symbol:string;
    styles:string;
    animation:TargetAndTransition|undefined;

    constructor(locationData:MapLocationData){
        this.locationData = locationData;

        const specificLocationData = explorationLocationData.allKeyVisuals.find(data => data.key === locationData.getKey());
        this.symbol = "";
        this.styles = "";
        this.animation = undefined;

        if(specificLocationData){
            this.symbol = specificLocationData.visualInfo.symbol;
            this.styles = specificLocationData.visualInfo.styles;
        }

        if(locationData.getFloating()){
            this.animation = {
                translateY: ["2px", "-2px", "2px"],
                transition: {
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "loop"
                }       
            };
        }
    }

    getSymbol(): string {
        return this.symbol;
    }
    getStyles(): string {
        return this.styles;
    }
    getAnimation(): TargetAndTransition | undefined {
        return this.animation;
    }
}

export default MapLocationVisualJSON;