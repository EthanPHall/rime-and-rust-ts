import Directions from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import CombatAction, { Attack, BurningFloorAttack, Block, Move, PullRange5, PushRange5, VolatileCanExplosion } from "./CombatAction";
import CombatEntity from "./CombatEntity";
import CombatHazard from "./CombatHazard";
import CombatMapData from "./CombatMapData";

enum CombatActionNames{
    Move = "Move",
    Attack = "Attack",
    Block = "Block",
    VolatileCanExplosion = "VolatileCanExplosion",
    AttackForHazards = "AttackForHazards",
    PullRange5 = "PullRange5",
    PushRange5 = "PushRange5",
}

class CombatActionFactory{
    getMap: () => CombatMapData;
    updateEntity: (id: number, newEntity: CombatEntity) => void;
    refreshMap: () => void;
    getHazardsList: () => CombatHazard[];
    setHazardsList: (newHazards: CombatHazard[]) => void;

    constructor(
        getMap: () => CombatMapData,
        updateEntity: (id: number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
        getHazardsList: () => CombatHazard[],
        setHazardsList: (newHazards: CombatHazard[]) => void
    ){
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
        this.getHazardsList = getHazardsList;
        this.setHazardsList = setHazardsList;
    }

    createAction(actionName: CombatActionNames, ownerId: number, direction: Directions = Directions.NONE, ownerEntity:CombatEntity|undefined = undefined): CombatAction{
        switch(actionName){
            case CombatActionNames.Move:
                return new Move(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Attack:
                return new Attack(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Block:
                return new Block(ownerId, this.updateEntity, this.refreshMap);
            case CombatActionNames.VolatileCanExplosion:
                return new VolatileCanExplosion(ownerId, this.getMap, this.getHazardsList, this.setHazardsList, this.updateEntity, this.refreshMap);
            case CombatActionNames.AttackForHazards:
                if(ownerEntity === undefined){
                    throw new Error("Owner entity must be defined for AttackForHazards");
                }
                return new BurningFloorAttack(ownerId, direction, 0, ownerEntity, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.PullRange5:
                return new PullRange5(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.PushRange5:
                return new PushRange5(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            default:
                throw new Error("Invalid action name: " + actionName);
        }
    }

    createAttackForHazards(ownerId: number, direction: Directions, ownerEntity: CombatEntity): CombatAction{
        if(ownerEntity === undefined){
            throw new Error("Owner entity must be defined for AttackForHazards");
        }
        return new BurningFloorAttack(ownerId, direction, 0, ownerEntity, this.getMap, this.updateEntity, this.refreshMap);
    }

    createVolatileCanExplosion(ownerId: number): CombatAction{
        return new VolatileCanExplosion(ownerId, this.getMap, this.getHazardsList, this.setHazardsList, this.updateEntity, this.refreshMap);
    }
}

export default CombatActionFactory;
export {CombatActionNames};