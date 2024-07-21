import Noise from "noise-ts";
import IMapLocation from "./IMapLocation";
import IMapLocationFactory from "./IMapLocationFactory";
import MapLocationData from "./MapLocationData";
import explorationLocationData from "../../data/exploration/exploration-location-data.json";
import MapLocationJSON from "./MapLocationJSON";

class MapLocationFactoryJSONSimplexNoise implements IMapLocationFactory {
    private seed: number;
    private noise: Noise;

    constructor(seed: number){
        this.seed = seed;
        this.noise = new Noise(seed);
    }

    createLocationWithData(data: MapLocationData): IMapLocation {
        throw new Error("Method not implemented.");
    }
    createExactLocation(data: MapLocationData): IMapLocation {
        throw new Error("Method not implemented.");
    }
    createBackgroundLocation(data: MapLocationData): IMapLocation {
        //Get the noise value for the location's position. Multiply is by 100 to fit with the ranges defined in the exploration-location-data.json file.
        //12 and 9 are arbitrary numbers that seem to work well for the noise function.
        const noiseValue = Math.abs(this.noise.simplex2(data.getPosition().x / 12, data.getPosition().y / 9) * 100);
        // console.log(`Noise value for location at ${data.getPosition().x}, ${data.getPosition().y}: ${noiseValue}`);

        //Get a list of the background locations
        const backgroundLocations = explorationLocationData.locations.filter(location => explorationLocationData.backgroundLocations.includes(location.key));

        //Find the background location that fits the noise value
        const locationData = backgroundLocations.find(location => location.range.min <= noiseValue && location.range.max > noiseValue);

        //Is location data defined?
        if(locationData){
            //Yes: Create the location
            return new MapLocationJSON(data.getPosition(), locationData.name, locationData.key, data.getCleared(), data.getRevealed(), data.getFloating());
        }
        else{
            //No: Is there a default location?
            if(backgroundLocations[0]){
                //Yes: Create the location
                console.log(`No background location data found for noise value ${noiseValue}. Using default location.`);
                return new MapLocationJSON(data.getPosition(), backgroundLocations[0].name, backgroundLocations[0].key, data.getCleared(), data.getRevealed(), data.getFloating());
            }
            else{
                //No: Throw an error
                throw new Error(`No background location data found for noise value ${noiseValue}. No default location found.`);
            }
        }
    }
}

export default MapLocationFactoryJSONSimplexNoise;