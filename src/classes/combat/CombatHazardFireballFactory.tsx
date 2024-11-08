import IdGenerator from "../utility/IdGenerator";
import Vector2 from "../utility/Vector2";
import CombatHazard, { BurningFloor, Fireball, VolatileCanister, Wall } from "./CombatHazard";
import hazardsJSONData from "../../data/combat/hazards.json"
import CombatMapData from "./CombatMapData";
import CombatEntity from "./CombatEntity";
import CombatAction from "./CombatAction";
import CombatActionFactory from "./CombatActionFactory";
import { ISettingsManager, RNGFunction } from "../../context/misc/SettingsContext";
import Directions from "../utility/Directions";

class CombatHazardFireballFactory{
    private getMap: () => CombatMapData;
    private updateEntity: (id:number, newEntity: CombatEntity) => void;
    private refreshMap: () => void;

    private advanceTurn: () => void;
    private addActionToList: (action: CombatAction) => void;
    private executeActionsList: () => void;
    private settingsManager:ISettingsManager;

    constructor(
        getMap: () => CombatMapData,
        updateEntity: (id:number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
        advanceTurn: () => void,
        addActionToList: (action: CombatAction) => void,
        executeActionsList: () => void,
        settingsManager:ISettingsManager
    ){
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
    
        this.advanceTurn = advanceTurn;
        this.addActionToList = addActionToList;
        this.executeActionsList = executeActionsList;

        this.settingsManager = settingsManager;
    }

    createFireball(position:Vector2, direction:Directions):CombatHazard{
        const id:number = IdGenerator.generateUniqueId();
        return new Fireball(
            id,
            position,
            direction,
            this.advanceTurn,
            this.addActionToList,
            this.executeActionsList,
            this.getMap,
            this.updateEntity,
            this.refreshMap,
            this.settingsManager,
        );
    }

}

export default CombatHazardFireballFactory;