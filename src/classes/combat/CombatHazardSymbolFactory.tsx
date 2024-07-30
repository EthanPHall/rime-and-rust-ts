import Vector2 from "../utility/Vector2";
import CombatHazard from "./CombatHazard";
import ICombatHazardFactory from "./ICombatHazardFactory";

class CombatHazardSymbolFactory implements ICombatHazardFactory{
    private mapRepresentation:string[][];

    constructor(mapRepresentation:string[][]){
        this.mapRepresentation = mapRepresentation;
    }

    createGivenPositions(positions: Vector2): CombatHazard[] {
        throw Error("Not implemented");
    }
}