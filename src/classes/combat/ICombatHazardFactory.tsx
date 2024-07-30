import Vector2 from "../utility/Vector2";
import CombatHazard from "./CombatHazard";

interface ICombatHazardFactory{
    createGivenPositions(positions:Vector2):CombatHazard[];
}

export default ICombatHazardFactory;