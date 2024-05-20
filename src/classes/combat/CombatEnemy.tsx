import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";

abstract class CombatEnemy extends CombatEntity{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
      super(hp, maxHp, symbol, name, position);
    }
  }
  
  class RustedShambler extends CombatEnemy{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
      super(hp, maxHp, symbol, name, position);
    }
  }
  
  class RustedBrute extends CombatEnemy{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
      super(hp, maxHp, symbol, name, position);
    }
  }

export default CombatEnemy;
export { RustedShambler, RustedBrute };