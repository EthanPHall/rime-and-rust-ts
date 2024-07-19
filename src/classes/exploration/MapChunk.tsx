import Vector2 from "../utility/Vector2";
import IMap from "./IMap";
import IMapLocation from "./IMapLocation";
import IMapLocationFactory from "./IMapLocationFactory";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";

class MapChunk implements IMap{

    private factory: IMapLocationFactory;
    private dimensions: Vector2;
    private distanceFromCenter: number;
    private position: Vector2;
    private locations: IMapLocation[][];

    /**
     * 
     * @param factory 
     * @param dimensions rounds up to the nearest odd number for both x and y 
     * @param position 
     * @param distanceFromCenter 
     */
    constructor(
        factory: IMapLocationFactory,
        dimensions: Vector2,
        position: Vector2,
        distanceFromCenter: number
    ){
        this.dimensions = dimensions;
        if(dimensions.x % 2 === 0){
            dimensions.x++;
        }
        if(dimensions.y % 2 === 0){
            dimensions.y++;
        }

        this.distanceFromCenter = distanceFromCenter;
        this.factory = factory;
        this.position = position;

        this.locations = [];
        for(let y = 0; y < dimensions.y; y++){
            this.locations[y] = [];
            for(let x = 0; x < dimensions.x; x++){
                //Create the location. Be sure to use the location's position relative to the map as a whole.
                //The new location's position will be changed back to be relative to the chunk after creation.
                const location = factory.createBackgroundLocation(
                    new MapLocationData(
                        new Vector2(position.x * dimensions.x + x, position.y * dimensions.y + y),
                        "",
                        "",
                        false,
                        false,
                        false
                    )
                );

                //Correct the location's position
                location.setPosition(new Vector2(x, y));

                this.locations[y][x] = location;
            }
        }
    }

    private setLocations(locations: IMapLocation[][]): void{
        this.locations = locations;
    }

    get2DRepresentation(): IMapLocationVisual[][] {
        return this.locations.map(row => row.map(location => location.getVisual()));
    }
    getLocationData(position: Vector2): MapLocationData {
        return this.locations[position.y][position.x].getData();
    }
    clone(): IMap {
        const newChunk = new MapChunk(this.factory, this.dimensions, this.position, this.distanceFromCenter);
        newChunk.setLocations(this.locations);

        return newChunk;
    }
    setCleared(position: Vector2): void {
        this.locations[position.y][position.x].setCleared();
    }
    setRevealed(position: Vector2): void {
        this.locations[position.y][position.x].setRevealed();
    }
    setFloating(position: Vector2): void {
        this.locations[position.y][position.x].setFloating();
    }
    getDimensions(): Vector2 {
        return this.dimensions; 
    }

    getDistanceFromCenter(): number{
        return this.distanceFromCenter;
    }
    getPosition(): Vector2{
        return this.position;
    }
}

export default MapChunk;