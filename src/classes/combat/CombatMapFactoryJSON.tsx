import { CombatMapTemplate, CombatMapTemplateBasic } from "../../components/combat/CombatParent/CombatParent";
import ICombatMapTemplateFactory from "./ICombatMapTemplateFactory";
import mapJSONData from "../../data/combat/combat-maps.json";
import enemyGroupsJSONData from "../../data/combat/enemy-groups.json";
import CombatHazard from "./CombatHazard";
import CombatEnemy from "./CombatEnemy";
import CombatPlayer from "./CombatPlayer";
import Vector2 from "../utility/Vector2";
import ICombatEnemyFactory from "./ICombatEnemyFactory";
import CombatEnemySymbolFactory from "./CombatEnemySymbolFactory";
import CombatAction from "./CombatAction";
import CombatMapData from "./CombatMapData";
import CombatEntity from "./CombatEntity";
import ICombatHazardFactory from "./ICombatHazardFactory";
import CombatHazardSymbolFactory from "./CombatHazardSymbolFactory";
import CombatActionFactory from "./CombatActionFactory";

class CombatMapTemplateFactoryJSON implements ICombatMapTemplateFactory{
    private advanceTurn: () => void;
    private addActionToList: (action: CombatAction) => void;
    private executeActionsList: () => void;
    private getMap: () => CombatMapData;
    private updateEntity: (id:number, newEntity: CombatEntity) => void;
    private refreshMap: () => void;

    private actionFactory: CombatActionFactory;

    constructor(
        advanceTurn: () => void,
        addActionToList: (action: CombatAction) => void,
        executeActionsList: () => void,
        getMap: () => CombatMapData,
        updateEntity: (id:number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
        actionFactory: CombatActionFactory
    ){
        this.advanceTurn = advanceTurn;
        this.addActionToList = addActionToList;
        this.executeActionsList = executeActionsList;
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
        this.actionFactory = actionFactory;
    }

    createMap(mapKey: string): CombatMapTemplate {
        let mapRepresentation = mapJSONData.maps.find((data) => {return mapKey == data.mapKey});
        if(!mapRepresentation){
            console.log("No Map with key " + mapKey + " found, using first map instead.");
            mapRepresentation = mapJSONData.maps[0];

            if(!mapRepresentation){
                throw Error("No combat maps found.");
            }
            if(mapRepresentation.mapRepresentation.length == 0){
                throw Error("Map with key " + mapKey + " is blank, no rows.");
            }
        }

        //Convert each row of the representation to an array of strnings, each representing a space
        //on the map.
        const mapRepresentationModified:string[][] = mapRepresentation.mapRepresentation.map((row) => {
            return row.split(mapJSONData.separator);
        })

        //get the length of the longest row
        let longestRowLength = 0;
        mapRepresentationModified.forEach((row) => {
            if(row.length > longestRowLength){
                longestRowLength = row.length;
            }
        })

        if(longestRowLength == 0){
            throw Error("Map with key " + mapKey + " is blank, no columns.");
        }

        const size:Vector2 = new Vector2(mapRepresentationModified.length, longestRowLength);

        //Determine what enemies and hazards may spawn on this map, and the chancees for each player spawn point
        const rng:number = Math.floor(Math.random() * 100);
        let cumulativeChance:number = 0;
        const enemyGroup = mapRepresentation.potentialEnemyGroups.find((group) => {
            cumulativeChance += group.chance;
            return rng <= cumulativeChance;
        }) || mapJSONData.defaultEnemyGroup;

        cumulativeChance = 0;
        const hazardGroup = mapRepresentation.potentialHazardGroups.find((group) => {
            cumulativeChance += group.chance;
            return rng <= cumulativeChance;
        }) || mapJSONData.defaultHazardGroup;

        //Loop through each space and determine if it is blank, enemy, hazard, or player spawn.
        //Keep track of the positions of each important space
        const enemyPositions:Vector2[] = [];
        const hazardPositions:Vector2[] = [];
        const potentialPlayerSpawns:Vector2[] = [];
        mapRepresentationModified.forEach((row, y) => {
            row.forEach((mapLocation, x) => {
                if(mapJSONData.enemySymbols.includes(mapLocation)){
                    enemyPositions.push(new Vector2(x,y));
                }
                else if(mapJSONData.hazardSymbols.includes(mapLocation)){
                    hazardPositions.push(new Vector2(x,y));
                }
                else if(mapJSONData.playerSpawnSymbols.includes(mapLocation)){
                    potentialPlayerSpawns.push(new Vector2(x,y));
                }
                //Else, that means the space is blank so just ignore it.
            });
        });

        //Instantiate and use factories to create the enemies and hazards
        const enemyFactory:ICombatEnemyFactory = new CombatEnemySymbolFactory(
            mapRepresentationModified, 
            enemyGroup.enemyGroupKey,
            this.advanceTurn,
            this.addActionToList,
            this.executeActionsList,
            this.getMap,
            this.updateEntity,
            this.refreshMap,
        );
        const enemies:CombatEnemy[] = enemyFactory.createGivenPositions(enemyPositions);

        const hazardFactory:ICombatHazardFactory = new CombatHazardSymbolFactory(
            mapRepresentationModified,
            hazardGroup.hazardGroupKey,
            this.getMap,
            this.updateEntity,
            this.refreshMap,
            this.actionFactory,
            this.addActionToList
        )
        const hazards:CombatHazard[] = hazardFactory.createGivenPositions(hazardPositions);

        return new CombatMapTemplateBasic(
            size,
            enemies,
            hazards,
            this.advanceTurn
        )
    }
}

export default CombatMapTemplateFactoryJSON;