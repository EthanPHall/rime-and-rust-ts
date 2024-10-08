import Vector2 from "../utility/Vector2";
import IMap from "./IMap";
import IMapLocationFactory from "./IMapLocationFactory";
import MapChunk from "./MapChunk";
import MapLocationData from "./MapLocationData";
import IMapLocationVisual from "./IMapLocationVisual";
import DifficultyBrackets from "./DifficultyBrackets";
import explorationLocationJSONData from "../../data/exploration/exploration-location-data.json";
import RimeEventJSON from "../events/RimeEventJSON";
import ArrayScrambler from "../utility/ArrayScrambler";
import IMapLocation from "./IMapLocation";
import { RNGFunction, SaveObject } from "../../context/misc/SettingsContext";
import ISaveable from "../utility/ISaveable";

class ChunkMap implements IMap{
    private factory: IMapLocationFactory;
    private dimensions: Vector2;
    private chunkDimensions: Vector2;
    private centerPoint: Vector2;
    private chunks: MapChunk[][];

    private representation:IMapLocationVisual[][]|undefined = undefined;

    private rngFunction:RNGFunction;

    /**
     * 
     * @param factory 
     * @param dimensions rounds up to the nearest odd number for both x and y
     * @param chunkDimensions rounds up to the nearest odd number for both x and y
     */
    constructor(
        factory: IMapLocationFactory,
        dimensions: Vector2,
        chunkDimensions: Vector2,
        rngFunction:RNGFunction
    ){
        this.rngFunction = rngFunction;

        this.factory = factory;
        this.dimensions = dimensions;
        if(dimensions.x % 2 === 0){
            dimensions.x++;
        }
        if(dimensions.y % 2 === 0){
            dimensions.y++;
        }

        this.chunkDimensions = chunkDimensions;
        if(chunkDimensions.x % 2 === 0){
            chunkDimensions.x++;
        }
        if(chunkDimensions.y % 2 === 0){
            chunkDimensions.y++;
        }

        const centerPointRelativeToChunks = new Vector2(Math.floor(dimensions.x / 2), Math.floor(dimensions.y / 2));
        this.centerPoint = new Vector2(Math.floor((dimensions.x * chunkDimensions.x) / 2), Math.floor((dimensions.y * chunkDimensions.y) / 2));

        this.chunks = [];
        let maxDistanceFromCenter = -Infinity;
        for(let y = 0; y < dimensions.y; y++){
            this.chunks[y] = [];
            for(let x = 0; x < dimensions.x; x++){
                const position = new Vector2(x, y);
                const distanceFromCenter = Vector2.manhattanDistance(position, centerPointRelativeToChunks);

                maxDistanceFromCenter = Math.max(maxDistanceFromCenter, distanceFromCenter);

                this.chunks[y][x] = new MapChunk(factory, chunkDimensions, new Vector2(x, y), distanceFromCenter, rngFunction);
            }
        }

        const difficultyBrackets:DifficultyBrackets = new DifficultyBrackets(maxDistanceFromCenter, explorationLocationJSONData.difficultyBrackets);
        this.generateLocations(difficultyBrackets, rngFunction);
    }

    private placeHome(){
        const {chunk, position} = this.getChunkAndPosition(this.centerPoint);
        chunk.placeHomeLocation();
    }

    private generateLocations(difficultyBrackets:DifficultyBrackets, rngFunction:RNGFunction){
        //Get how many total locations there are
        const totalLocationsCount:number =  this.chunkDimensions.x * this.chunkDimensions.y * this.dimensions.x * this.dimensions.y;
        
        //Get how many total explorable locations there should be
        const totalLocationsToSpawnCount:number = Math.floor(totalLocationsCount * explorationLocationJSONData.explorableLocationsTotalPercentage / 100);
        
        //Make a new list with an entry for each difficulty bracket. Determine how many locations each bracket should spawn.
        const locationsToSpawnByBracket:number[] = [];
        for(let i = 0; i < explorationLocationJSONData.difficultyBrackets; i++){
            const percentages = explorationLocationJSONData.percentagesByDifficultyBracket;
            locationsToSpawnByBracket.push(Math.floor(totalLocationsToSpawnCount * percentages[Math.min(i, percentages.length - 1)] / 100));
        }
        
        //Divide chunks into lists, filtered by difficulty brackets
        const chunksByDifficultyBracket:MapChunk[][] = [];
        for(let i = 0; i < explorationLocationJSONData.difficultyBrackets; i++){ chunksByDifficultyBracket.push([]); }

        this.chunks.forEach((row) => {
            row.forEach((chunk) => {
                const bracketForThisChunk = difficultyBrackets.getDifficultyBracket(chunk.getDistanceFromCenter());
                
                chunksByDifficultyBracket[bracketForThisChunk].push(chunk);
            });
        })
        
        //Foreach chunk list:
        chunksByDifficultyBracket.forEach((chunkList, bracket) => {
            //Scramble the chunk list
            const scrambledList:MapChunk[] = ArrayScrambler.scrambleArray(chunkList, rngFunction);

            //Get the number of locations to spawn for this difficulty bracket
            let locationsToGo:number = locationsToSpawnByBracket[bracket];

            //Make a new list to keep track of how many locations each chunk should spawn. It should have a length equal to the number of chunks in the chunk list, and be initialized with 0's
            let locationsPerChunk:number[] = Array(chunkList.length).fill(0);
            
            //Loop through that new list of numbers until the locations to spawn count reaches 0
            while(locationsToGo > 0){
                for(let i = 0; i < locationsPerChunk.length; i++){
                    //Randomly choose between a max and a min number. Take that number, or the remaining number that was distrubuted earlier, whever is less, and add it to the list of numbers at the current index
                    const toSpawn:number = Math.min( rngFunction(0,1), locationsToGo );
                    locationsPerChunk[i] += toSpawn;   
                    
                    //Keep track of how many have been added. 
                    locationsToGo -= toSpawn;

                    //If the number added matches the number of locations for this bracket, break.
                    if(locationsToGo <= 0){
                        break;
                    }
                }
            }

            //Foreach chunk in the scrambled list, have that chunk generate a number of locations equal to the current index in the "how many locations each chunk should spawn" list
            scrambledList.forEach((chunk, i) => {
                chunk.generateLocations(difficultyBrackets.getDifficultyBracket(chunk.getDistanceFromCenter()), locationsPerChunk[i]);
            })
        });
        
        this.placeHome();
    }

    getChunk(position:Vector2){
        return this.chunks[Math.floor(position.y / this.chunkDimensions.y)][Math.floor(position.x / this.chunkDimensions.x)];
    }
    getPositionInChunk(position:Vector2){
        return new Vector2(position.x % this.chunkDimensions.x, position.y % this.chunkDimensions.y);
    }

    getEventToStart(position: Vector2): string | null {
        //Get which chunk the position is in
        const chunk = this.getChunk(position);

        return chunk.getEventToStart(this.getPositionInChunk(position));
    }

    get2DRepresentation(): IMapLocationVisual[][] {
        const result: IMapLocationVisual[][] = [];
        
        for(let y = 0; y < this.dimensions.y; y++){
            for(let x = 0; x < this.dimensions.x; x++){
                const chunk = this.chunks[y][x];
                const chunkRepresentation = chunk.get2DRepresentation();
                for(let cy = 0; cy < chunkRepresentation.length; cy++){
                    const mapRelativeY = y * this.chunkDimensions.y + cy;
                    if(result[mapRelativeY] == undefined){
                        result[mapRelativeY] = [];
                    }
                    for(let cx = 0; cx < chunkRepresentation[cy].length; cx++){
                        const mapRelativeX = x * this.chunkDimensions.x + cx;
                        result[mapRelativeY][mapRelativeX] = chunkRepresentation[cy][cx];
                    }
                }
            }
        }

        this.representation = result;
        return this.representation;
    }

    private getChunkAndPosition(position: Vector2): {chunk:MapChunk, position:Vector2} {
        //Given the location position, we need to find the chunk that contains it
        const chunk = this.getChunk(position);

        //Find the position of the location within the chunk
        const chunkPosition = this.getPositionInChunk(position);

        return {chunk:chunk, position: chunkPosition};
    }
    getLocationData(position: Vector2): MapLocationData {
        const {chunk, position:chunkPosition} = this.getChunkAndPosition(position);

        //Get the location data from the chunk
        return chunk.getLocationData(chunkPosition);
    }

    getLocation(position: Vector2): IMapLocation {
        const {chunk, position:chunkPosition} = this.getChunkAndPosition(position);

        //Get the location from the chunk
        return chunk.getLocation(chunkPosition);
    }

    clone(): IMap {
        //Get a new empty ChunkMap
        const newMap = new ChunkMap(this.factory, new Vector2(0,0), new Vector2(0,0), this.rngFunction);
        
        //Set the data of the new map to match this one
        newMap.setData(this.factory, this.dimensions, this.chunkDimensions, this.centerPoint, this.chunks);

        return newMap;
    }
    private setData(
        factory: IMapLocationFactory,
        dimensions: Vector2,
        chunkDimensions: Vector2,
        centerPoint: Vector2,
        chunks: MapChunk[][],
    ): void{
        this.factory = factory;
        this.dimensions = dimensions;
        this.chunkDimensions = chunkDimensions;
        this.centerPoint = centerPoint;
        this.chunks = chunks
    }

    setCleared(position: Vector2): void {
        const {chunk, position:chunkPosition} = this.getChunkAndPosition(position);
        chunk.setCleared(chunkPosition);
    }
    setRevealed(position: Vector2): void {
        const {chunk, position:chunkPosition} = this.getChunkAndPosition(position);
        chunk.setRevealed(chunkPosition);
    }
    setFloating(position: Vector2): void {
        const {chunk, position:chunkPosition} = this.getChunkAndPosition(position);
        chunk.setFloating(chunkPosition);
    }
    getDimensions(): Vector2 {
        return new Vector2(this.dimensions.x * this.chunkDimensions.x, this.dimensions.y * this.chunkDimensions.y);
    }

    getCenterPoint(): Vector2 {
        return new Vector2(this.centerPoint.x, this.centerPoint.y);
    }


    createSaveObject() {
        return{
            dimensionsData:{ 
                x: this.dimensions.x,
                y: this.dimensions.y
            },
            chunkDimensionsData:{ 
                x: this.chunkDimensions.x,
                y: this.chunkDimensions.y
            },
            centerPointData:{ 
                x: this.centerPoint.x,
                y: this.centerPoint.y
            },
            chunksData:this.chunks.map<any[]>((row) => { 
                return row.map((currentChunk) => {
                    return currentChunk.createSaveObject();
                })
            }),
        }
    }
    loadSaveObject(saveObject:SaveObject) {
        const mapData = saveObject.mapData;
        const dimensionsData = mapData.dimensionsData;
        const chunkDimensionsData = mapData.chunkDimensionsData;
        const centerPointData = mapData.centerPointData;
        const chunksData = mapData.chunksData;

        if(
            !dimensionsData || 
            !chunkDimensionsData ||
            !centerPointData ||
            !chunksData
        ){
            console.log("Could not load ChunkMap. dimensionsData, chunkDimensionsData, centerPointData, and chunksData, respectively: ",
                dimensionsData,
                chunkDimensionsData,
                centerPointData,
                chunksData
            )
            return;
        }

        this.dimensions = new Vector2(dimensionsData.x, dimensionsData.y);
        this.chunkDimensions = new Vector2(chunkDimensionsData.x, chunkDimensionsData.y);
        this.centerPoint = new Vector2(centerPointData.x, centerPointData.y);
        this.chunks = chunksData.map((rowData:any) => {
            return rowData.map((chunkData:any) => {
                const newChunk = new MapChunk(
                    this.factory,
                    new Vector2(1,1),
                    new Vector2(1,1),
                    0,
                    this.rngFunction
                );

                newChunk.loadSaveObject(chunkData)
                return newChunk;
            });
        });
    }

    isDataValid(saveObject:SaveObject): boolean {
        const mapData = saveObject.mapData;

        if(mapData == null && mapData == undefined){
            return false;
        }

        const dimensionsData = mapData.dimensionsData;
        const chunkDimensionsData = mapData.chunkDimensionsData;
        const centerPointData = mapData.centerPointData;
        const chunksData = mapData.chunksData;

        return (
            dimensionsData != null && dimensionsData != undefined &&
            dimensionsData.x != null && dimensionsData.x != undefined &&
            dimensionsData.y != null && dimensionsData.y != undefined &&
            chunkDimensionsData != null && chunkDimensionsData != undefined &&
            chunkDimensionsData.x != null && chunkDimensionsData.x != undefined &&
            chunkDimensionsData.y != null && chunkDimensionsData.y != undefined &&
            centerPointData != null && centerPointData != undefined &&
            centerPointData.x != null && centerPointData.x != undefined &&
            centerPointData.y != null && centerPointData.y != undefined &&
            chunksData != null && chunksData != undefined && Array.isArray(chunksData)
        )
    }
}

export default ChunkMap;