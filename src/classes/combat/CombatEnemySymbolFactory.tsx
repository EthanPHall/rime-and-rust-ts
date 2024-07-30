import Vector2 from "../utility/Vector2";
import CombatEnemy, { RustedBrute, RustedShambler } from "./CombatEnemy";
import ICombatEnemyFactory from "./ICombatEnemyFactory";
import enemyGroupsJSONData from "../../data/combat/enemy-groups.json";
import enemiesJSONData from "../../data/combat/enemies.json";
import IdGenerator from "../utility/IdGenerator";
import CombatAction from "./CombatAction";
import CombatMapData from "./CombatMapData";
import CombatEntity from "./CombatEntity";
import ArrayScrambler from "../utility/ArrayScrambler";

class CombatEnemySymbolFactory implements ICombatEnemyFactory{
    private mapRepresentation:string[][];
    private enemyGroupKey:string;

    private advanceTurn: () => void;
    private addActionToList: (action: CombatAction) => void;
    private executeActionsList: () => void;
    private getMap: () => CombatMapData;
    private updateEntity: (id:number, newEntity: CombatEntity) => void;
    private refreshMap: () => void;


    constructor(
        mapRepresentation:string[][], 
        enemyGroupKey:string,
        advanceTurn: () => void,
        addActionToList: (action: CombatAction) => void,
        executeActionsList: () => void,
        getMap: () => CombatMapData,
        updateEntity: (id:number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
    ){
        this.mapRepresentation = mapRepresentation;
        this.enemyGroupKey = enemyGroupKey;
        this.advanceTurn = advanceTurn;
        this.addActionToList = addActionToList;
        this.executeActionsList = executeActionsList;
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
    }

    createEnemy(enemyKey:string, position:Vector2):CombatEnemy{
        const id:number = IdGenerator.generateUniqueId();
        switch(enemyKey){
            case enemiesJSONData.keys.basicRustedShambler:    
                return new RustedShambler(
                    id,
                    position,
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap
                );
            case enemiesJSONData.keys.basicRustedBrute:    
                return new RustedBrute(
                    id,
                    position,
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap
                );
            default:
                console.log("No enemy with key " + enemyKey + " found, using default instead.");
                return new RustedShambler(
                    id,
                    position,
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap
                );
        }
    }

    createGivenPositions(positions: Vector2[]): CombatEnemy[] {
        const results:CombatEnemy[] = [];

        const enemyGroup = enemyGroupsJSONData.enemyGroups.find((data) => {
            return data.enemyGroupKey == this.enemyGroupKey;
        }) || enemyGroupsJSONData.defaultGroup;

        const staticPositions = positions.filter((position) => {
            const symbol:string = this.mapRepresentation[position.y][position.x];
            return enemiesJSONData.enemies.find(
                (enemyData) => {return enemyData.mapGenerationSymbol == symbol})
        });
        const wildcardPositions = positions.filter((position) => {
            const symbol:string = this.mapRepresentation[position.y][position.x];
            return !enemiesJSONData.enemies.find(
                (enemyData) => {return enemyData.mapGenerationSymbol == symbol}
            );
        });

        //For the static positions, just instantiate the given enemy
        staticPositions.forEach((position) => {
            const symbol:string = this.mapRepresentation[position.x][position.y];
            const enemyKey:string = enemiesJSONData.enemies.find((enemyData) => {return enemyData.mapGenerationSymbol == symbol})?.enemyKey || "";
            results.push(this.createEnemy(enemyKey, position));
        });

        //For the wildcard positions, choose which enemies to instantiate based on the chances defined in the enemyGroup
        const wildCardsScrambled = ArrayScrambler.scrambleArray(wildcardPositions);
        const enemiesToInstantiate:string[] = [];
        enemyGroup.enemies.forEach((enemyPlusChance) => {
            const amount:number = Math.ceil(enemyPlusChance.percent / 100 * wildCardsScrambled.length);
            for(let i = 0; i < amount; i++){
                enemiesToInstantiate.push(enemyPlusChance.enemyKey);
            }
        })

        wildCardsScrambled.forEach((position, i) => {
            const enemyKey:string|undefined = enemiesToInstantiate?.[i];

            if(enemyKey){
                results.push(this.createEnemy(enemyKey, position));
            }
        })

        return results;
    }
}

export default CombatEnemySymbolFactory;