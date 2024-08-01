import Vector2 from "../utility/Vector2";
import IMap from "./IMap";
import IMapLocation from "./IMapLocation";
import IMapLocationFactory from "./IMapLocationFactory";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import explorationLocationJSONData from "../../data/exploration/exploration-location-data.json";
import RimeEventJSON from "../events/RimeEventJSON";
import ArrayScrambler from "../utility/ArrayScrambler";

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
    getEventToStart(position: Vector2): string | null {
        return this.locations[position.y][position.x].getEventToStart();
    }

    private setLocations(locations: IMapLocation[][]): void{
        this.locations = locations;
    }

    placeHomeLocation(){
        const homeLocation:IMapLocation = this.factory.createExactLocation(
            explorationLocationJSONData.homeLocation.key,
            new Vector2(Math.floor(this.dimensions.x / 2), Math.floor(this.dimensions.y / 2))
        )

        this.locations[homeLocation.getPostition().y][homeLocation.getPostition().x] = homeLocation;
    }

    get2DRepresentation(): IMapLocationVisual[][] {
        return this.locations.map(row => row.map(location => location.getVisual()));
    }
    getLocationData(position: Vector2): MapLocationData {
        return this.locations[position.y][position.x].getData();
    }
    getLocation(position: Vector2): IMapLocation {
        return this.locations[position.y][position.x];
    }
    clone(): IMap {
        const newChunk = new MapChunk(this.factory, this.dimensions, this.position, this.distanceFromCenter);
        newChunk.setLocations(this.locations);

        return newChunk;
    }
    setCleared(position: Vector2): void {
        this.locations[position.x][position.y].setCleared();
    }
    setRevealed(position: Vector2): void {
        this.locations[position.y][position.x].setRevealed();
    }
    setFloating(position: Vector2): void {
        this.locations[position.x][position.y].setFloating();
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

    getCenterPoint(): Vector2 {
        return new Vector2(Math.floor(this.dimensions.x/2), Math.floor(this.dimensions.y/2));
    }

    generateLocations(difficulty:number, totalLocations:number){
        //Get a list of locations for the given difficulty level
        const potentialLocations =  explorationLocationJSONData.explorationLocations.filter((location) => {
            return location.difficultyBrackets.includes(difficulty);
        })

        //scramble the potential locations
        const potentialLocationsScrambled = ArrayScrambler.scrambleArray(potentialLocations);

        //Create the locations
        const locationsCreated:IMapLocation[] = [];
        const chanceToFloat:number = explorationLocationJSONData.chancesToBeFloating?.[difficulty] || 0;
        potentialLocationsScrambled.forEach((potentialLocation, i) => {
            const locationsToCreate = 
                (i == potentialLocationsScrambled.length - 1) ? 
                    totalLocations - locationsCreated.length : 
                    Math.floor(Math.random() * (totalLocations - locationsCreated.length));

            for(let i = 0; i < locationsToCreate; i++){
                // if(Math.random() * 100 < locationData.chanceToSkipLocationGeneration){
                //     continue;
                // }

                let chunkPosition = new Vector2(Math.floor(Math.random() * this.dimensions.x), Math.floor(Math.random() * this.dimensions.y));
                
                // //TODO: Make a slightly more sophisticated way to ensure that the posiion is not already taken. Actually, changing this is necessary because doing it this way led to an infinite loop.
                // while(!locationData.backgroundLocations.includes(this.getLocationData(chunkPosition).getKey())){
                //     chunkPosition = new Vector2(Math.floor(Math.random() * this.dimensions.x), Math.floor(Math.random() * this.dimensions.y));
                // }

                const overallPosition = new Vector2(this.position.x * this.dimensions.x + chunkPosition.x, this.position.y * this.dimensions.y + chunkPosition.y);

                const newLocation:IMapLocation = this.factory.createExactLocation(potentialLocation.key, overallPosition);
                this.locations[chunkPosition.x][chunkPosition.y] = newLocation;

                if(Math.random() * 100 < chanceToFloat){
                    newLocation.setFloating();
                }

                locationsCreated.push(newLocation);
            }
        })
    }
}

export default MapChunk;