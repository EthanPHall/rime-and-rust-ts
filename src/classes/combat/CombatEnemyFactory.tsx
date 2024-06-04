import { Type } from "typescript";
import CombatEnemy, { RustedBrute, RustedShambler } from "./CombatEnemy";
import Vector2 from "../utility/Vector2";
import CombatAction, { CombatActionWithRepeat } from "./CombatAction";
import CombatMapData from "./CombatMapData";
import CombatEntity from "./CombatEntity";
import IdGenerator from "../utility/IdGenerator";


class CombatEnemyFactory{
    private advanceTurn: () => void;
    private addActionToList: (action: CombatAction) => void;
    private executeActionsList: () => void;
    private getMap: () => CombatMapData;
    private updateEntity: (id:number, newEntity: CombatEntity) => void;
    private refreshMap: () => void;

    constructor(
        advanceTurn: () => void,
        addActionToList: (action: CombatAction) => void,
        executeActionsList: () => void,
        getMap: () => CombatMapData,
        updateEntity: (id:number, newEntity: CombatEntity) => void,
        refreshMap: () => void
    ){
        this.advanceTurn = advanceTurn;
        this.addActionToList = addActionToList;
        this.executeActionsList = executeActionsList;
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
    }

    createEnemy(
        type: string, 
        initialPosition: Vector2, 
    ): CombatEnemy{
        switch(type){
            case 'RustedShambler':
                return new RustedShambler(
                    IdGenerator.generateUniqueId(), 
                    initialPosition, 
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap
                );
            case 'RustedBrute':
                return new RustedBrute(
                    IdGenerator.generateUniqueId(), 
                    initialPosition, 
                    this.advanceTurn,
                    this.addActionToList,
                    this.executeActionsList,
                    this.getMap,
                    this.updateEntity,
                    this.refreshMap
                );
            default:
                throw new Error('Enemy type not recognized');
        }
    }
}

export default CombatEnemyFactory;