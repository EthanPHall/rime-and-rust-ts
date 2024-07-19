import IMapLocation from "./IMapLocation";
import IMapLocationFactory from "./IMapLocationFactory";
import MapLocationData from "./MapLocationData";

class MapLocationFactoryJSONPerlinNoise implements IMapLocationFactory {
    createLocationWithData(data: MapLocationData): IMapLocation {
        throw new Error("Method not implemented.");
    }
    createExactLocation(data: MapLocationData): IMapLocation {
        throw new Error("Method not implemented.");
    }
}

export default MapLocationFactoryJSONPerlinNoise;