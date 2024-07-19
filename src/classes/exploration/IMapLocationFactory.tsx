import IMapLocation from "./IMapLocation";
import MapLocationData from "./MapLocationData";

interface IMapLocationFactory {
    /**
     * 
     * @param data This method chooses which type of location to generate, so key and name may be ingored. Otherwise, uses the rest of the data to fill the new Location's data.
     */
    createLocationWithData(data:MapLocationData):IMapLocation;

    /**
     * 
     * @param data This method creates a location with the exact data provided. This is useful for creating a location with a specific key.
     */
    createExactLocation(data:MapLocationData):IMapLocation;
}

export default IMapLocationFactory;