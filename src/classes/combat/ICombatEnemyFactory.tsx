import Vector2 from "../utility/Vector2";
import CombatEnemy from "./CombatEnemy";

interface ICombatEnemyFactory{
    createGivenPositions(positions:Vector2[]):CombatEnemy[];
}

export default ICombatEnemyFactory;