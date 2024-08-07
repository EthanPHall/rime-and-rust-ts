import { Type } from "typescript";
import CombatEnemy, { RustedBrute, RustedShambler } from "./CombatEnemy";
import Vector2 from "../utility/Vector2";
import CombatAction, { CombatActionWithRepeat } from "./CombatAction";
import CombatMapData from "./CombatMapData";
import CombatEntity from "./CombatEntity";
import IdGenerator from "../utility/IdGenerator";
import { EnemyType } from "../../components/combat/CombatParent/CombatParent";
import { SettingsManager } from "../../context/misc/SettingsContext";


class CombatEnemyFactory{
    private advanceTurn: () => void;
    private addActionToList: (action: CombatAction) => void;
    private executeActionsList: () => void;
    private getMap: () => CombatMapData;
    private updateEntity: (id:number, newEntity: CombatEntity) => void;
    private refreshMap: () => void;
    private settingsManager:SettingsManager;
    
    constructor(
        advanceTurn: () => void,
        addActionToList: (action: CombatAction) => void,
        executeActionsList: () => void,
        getMap: () => CombatMapData,
        updateEntity: (id:number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
        settingsManager:SettingsManager
    ){
        this.advanceTurn = advanceTurn;
        this.addActionToList = addActionToList;
        this.executeActionsList = executeActionsList;
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
        this.settingsManager = settingsManager;
    }

    createEnemy(
        type: string, 
        initialPosition: Vector2, 
    ): CombatEnemy{
        switch(type){
            case EnemyType.RustedShambler:
                return new RustedShambler(
                    IdGenerator.generateUniqueId(), 
                    initialPosition, 
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap,
                    this.settingsManager
                );
            case EnemyType.RustedBrute:
                return new RustedBrute(
                    IdGenerator.generateUniqueId(), 
                    initialPosition, 
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap,
                    this.settingsManager
                );
            default:
                throw new Error('Enemy type not recognized');
        }
    }
}

export default CombatEnemyFactory;