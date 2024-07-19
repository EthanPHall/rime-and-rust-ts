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

    /**
     * 
     * @param data This method chooses which background location to generate, so key and name may be ingored. Otherwise, uses the rest of the data to fill the new Location's data. Make sure that position is the location's position within the entire map, not within a chunk or other smaller area.
     */
    createBackgroundLocation(data:MapLocationData):IMapLocation;
}

export default IMapLocationFactory;