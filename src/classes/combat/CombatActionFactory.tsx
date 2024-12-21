import Directions from "../utility/Directions";
import Vector2 from "../utility/Vector2";
import CombatAction, { Attack, BurningFloorAttack, Block, Move, PullRange5, PushRange5, VolatileCanExplosion, Chop, Punch, Kick, Burn, Fireball, SpawnBurningRadius, DespawnBurningRadius, Slice, Lacerate, Grapple } from "./CombatAction";
import CombatEntity from "./CombatEntity";
import CombatHazard from "./CombatHazard";
import CombatHazardFireballFactory from "./CombatHazardFireballFactory";
import CombatMapData from "./CombatMapData";
import EntitySpawner from "./EntitySpawner";

enum CombatActionNames{
    Move = "Move",
    Attack = "Attack",
    Block = "Block",
    VolatileCanExplosion = "VolatileCanExplosion",
    AttackForHazards = "AttackForHazards",
    PullRange5 = "PullRange5",
    PushRange5 = "PushRange5",
    Chop = "Chop",
    Slice = "Slice",
    Lacerate = "Lacerate",
    Punch = "Punch",
    Grapple = "Grapple",
    Kick = "Kick",
    Burn = "Burn",
    Fireball = "Fireball",
    SpawnBurningRadius = "SpawnBurningRadius",
    DespawnBurningRadius = "DespawnBurningRadius",
}

function stringToCombatActionNames(actionName: string): CombatActionNames{
    switch(actionName){
        case "Move":
            return CombatActionNames.Move;
        case "Attack":
            return CombatActionNames.Attack;
        case "Block":
            return CombatActionNames.Block;
        case "VolatileCanExplosion":
            return CombatActionNames.VolatileCanExplosion;
        case "AttackForHazards":
            return CombatActionNames.AttackForHazards;
        case "PullRange5":
            return CombatActionNames.PullRange5;
        case "PushRange5":
            return CombatActionNames.PushRange5;
        case "Chop":
            return CombatActionNames.Chop;
        case "Slice":
            return CombatActionNames.Slice;
        case "Lacerate":
            return CombatActionNames.Lacerate;
        case "Punch":
            return CombatActionNames.Punch;
        case "Grapple":
            return CombatActionNames.Grapple;
        case "Kick":
            return CombatActionNames.Kick;
        case "Burn":
            return CombatActionNames.Burn;
        case "Fireball":
            return CombatActionNames.Fireball;
        case "SpawnBurningRadius":
            return CombatActionNames.SpawnBurningRadius;
        case "DespawnBurningRadius":
            return CombatActionNames.DespawnBurningRadius;
        default:
            throw new Error("Invalid action name: " + actionName);
    }
}

class CombatActionFactory{
    getMap: () => CombatMapData;
    updateEntity: (id: number, newEntity: CombatEntity) => void;
    refreshMap: () => void;
    getHazardsList: () => CombatHazard[];
    setHazardsList: (newHazards: CombatHazard[]) => void;

    entitySpawner: EntitySpawner;
    fireballFactory: CombatHazardFireballFactory;

    constructor(
        getMap: () => CombatMapData,
        updateEntity: (id: number, newEntity: CombatEntity) => void,
        refreshMap: () => void,
        getHazardsList: () => CombatHazard[],
        setHazardsList: (newHazards: CombatHazard[]) => void,
        entitySpawner: EntitySpawner,
        fireballFactory: CombatHazardFireballFactory
    ){
        this.getMap = getMap;
        this.updateEntity = updateEntity;
        this.refreshMap = refreshMap;
        this.getHazardsList = getHazardsList;
        this.setHazardsList = setHazardsList;
        this.entitySpawner = entitySpawner;
        this.fireballFactory = fireballFactory;
    }

    createAction(actionName: CombatActionNames, ownerId: number, direction: Directions = Directions.NONE, ownerEntity:CombatEntity|undefined = undefined): CombatAction{
        switch(actionName){
            case CombatActionNames.Move:
                return new Move(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Attack:
                return new Attack(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Block:
                return new Block(ownerId, this.updateEntity, this.refreshMap, this.getMap);
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
            case CombatActionNames.Chop:
                return new Chop(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Slice:
                return new Slice(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Lacerate:
                return new Lacerate(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Punch:
                return new Punch(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Grapple:
                return new Grapple(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Kick:
                return new Kick(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Burn:
                return new Burn(ownerId, direction, this.getMap, this.updateEntity, this.refreshMap);
            case CombatActionNames.Fireball:
                return new Fireball(ownerId, direction, this.updateEntity, this.refreshMap, this.entitySpawner, this.getMap, this.fireballFactory);
            case CombatActionNames.SpawnBurningRadius:
                return new SpawnBurningRadius(ownerId, this.updateEntity, this.refreshMap, this.entitySpawner, this.getMap);
            case CombatActionNames.DespawnBurningRadius:
                return new DespawnBurningRadius(ownerId, this.entitySpawner, this.updateEntity, this.refreshMap, this.getMap);
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
export {CombatActionNames, stringToCombatActionNames};