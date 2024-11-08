import IdGenerator from "../utility/IdGenerator";
import Vector2 from "../utility/Vector2";
import CombatHazard, { BurningFloor, Fireball, VolatileCanister, Wall } from "./CombatHazard";
import ICombatHazardFactory from "./ICombatHazardFactory";
import hazardsJSONData from "../../data/combat/hazards.json"
import hazardGroupsJSONData from "../../data/combat/hazard-groups.json"
import CombatMapData from "./CombatMapData";
import CombatEntity from "./CombatEntity";
import CombatActionFactory from "./CombatActionFactory";
import CombatAction from "./CombatAction";
import ArrayScrambler from "../utility/ArrayScrambler";
import { ISettingsManager, RNGFunction } from "../../context/misc/SettingsContext";
import Directions from "../utility/Directions";

class CombatHazardSymbolFactory implements ICombatHazardFactory{
    private mapRepresentation:string[][];
    private hazardGroupKey:string;

    private getMap: () => CombatMapData;
    private updateEntity: (id:number, newEntity: CombatEntity) => void;
    private refreshMap: () => void;
    private addToComboList: (action: CombatAction) => void;
    private actionFactory: CombatActionFactory;
    private rngFunction:RNGFunction;

    private advanceTurn: () => void;
    private addActionToList: (action: CombatAction) => void;
    private executeActionsList: () => void;
    private settingsManager:ISettingsManager;


    constructor(
        mapRepresentation:string[][],
        hazardGroupKey:string,
        getMap: () => CombatMapData,
        updateEntity: (id:number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
        actionFactory: CombatActionFactory,
        addToComboList: (action: CombatAction) => void,
        rngFunction:RNGFunction,
        advanceTurn: () => void,
        addActionToList: (action: CombatAction) => void,
        executeActionsList: () => void,
        settingsManager:ISettingsManager
    ){
        this.mapRepresentation = mapRepresentation;
        this.hazardGroupKey = hazardGroupKey;

        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
        this.actionFactory = actionFactory;
        this.addToComboList = addToComboList;
    
        this.rngFunction = rngFunction;

        this.advanceTurn = advanceTurn;
        this.addActionToList = addActionToList;
        this.executeActionsList = executeActionsList;

        this.settingsManager = settingsManager;
    }

    createHazard(hazardKey:string, position:Vector2):CombatHazard{
        const id:number = IdGenerator.generateUniqueId();
        switch(hazardKey){
            case hazardsJSONData.keys.basicWall:    
                return Wall.createDefaultWall(
                    position
                );
            case hazardsJSONData.keys.burning:    
                return new BurningFloor(
                    id,
                    position,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap
                );
            case hazardsJSONData.keys.volatileCanister:    
                return VolatileCanister.createDefaultVolatileCanister(
                    position,
                    this.actionFactory,
                    this.addToComboList
                );
            case hazardsJSONData.keys.fireball:
                return new Fireball(
                    id,
                    position,
                    Directions.RIGHT,
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap,
                    this.settingsManager,
                );
            default:
                console.log("No hazard with key " + hazardKey + " found, using default instead.");
                return Wall.createDefaultWall(
                    position
                );
        }
    }

    createGivenPositions(positions: Vector2[]): CombatHazard[] {
        const results:CombatHazard[] = [];

        const hazardGroup = hazardGroupsJSONData.hazardGroups.find((data) => {
            return data.hazardGroupKey == this.hazardGroupKey;
        }) || hazardGroupsJSONData.defaultGroup;

        const staticPositions = positions.filter((position) => {
            const symbol:string = this.mapRepresentation[position.y][position.x];
            return hazardsJSONData.hazards.find(
                (hazardData) => {return hazardData.mapGenerationSymbol == symbol})
        });
        const wildcardPositions = positions.filter((position) => {
            const symbol:string = this.mapRepresentation[position.y][position.x];
            return !hazardsJSONData.hazards.find(
                (hazardData) => {return hazardData.mapGenerationSymbol == symbol}
            );
        });

        //For the static positions, just instantiate the given hazard
        staticPositions.forEach((position) => {
            const symbol:string = this.mapRepresentation[position.y][position.x];
            const hazardKey:string = hazardsJSONData.hazards.find((hazardData) => {return hazardData.mapGenerationSymbol == symbol})?.hazardKey || "";
            results.push(this.createHazard(hazardKey, position));
        });

        //For the wildcard positions, choose which enemies to instantiate based on the chances defined in the hazardGroup
        const wildCardsScrambled = ArrayScrambler.scrambleArray(wildcardPositions, this.rngFunction);
        const hazardsToInstantiate:string[] = [];
        hazardGroup.hazards.forEach((hazardPlusChance) => {
            const amount:number = Math.ceil(hazardPlusChance.percent / 100 * wildCardsScrambled.length);
            for(let i = 0; i < amount; i++){
                hazardsToInstantiate.push(hazardPlusChance.hazardKey);
            }
        })

        wildCardsScrambled.forEach((position, i) => {
            const hazardKey:string|undefined = hazardsToInstantiate?.[i];

            if(hazardKey){
                results.push(this.createHazard(hazardKey, position));
            }
        })

        return results;
    }
}

export default CombatHazardSymbolFactory;