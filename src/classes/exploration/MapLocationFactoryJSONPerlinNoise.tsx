import IMapLocation from "./IMapLocation";
import IMapLocationFactory from "./IMapLocationFactory";
import MapLocationData from "./MapLocationData";

class MapLocationFactoryJSONPerlinNoise implements IMapLocationFactory {
    private seed: number;
    private perlinNoise: any;

    constructor(seed: number){
        this.seed = seed;
        this.perlinNoise = new Noise(seed);
    }

    createLocationWithData(data: MapLocationData): IMapLocation {
        throw new Error("Method not implemented.");
    }
    createExactLocation(data: MapLocationData): IMapLocation {
        throw new Error("Method not implemented.");
    }
}

export default MapLocationFactoryJSONPerlinNoise;