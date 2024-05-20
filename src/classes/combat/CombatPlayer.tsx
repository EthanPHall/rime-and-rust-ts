import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";

class CombatPlayer extends CombatEntity{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
      super(hp, maxHp, symbol, name, position);
    }
  }

export default CombatPlayer;