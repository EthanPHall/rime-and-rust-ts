import Vector2 from "../utility/Vector2";

abstract class CombatEntity{
    hp: number;
    maxHp: number;
    symbol: string;
    name: string;
    position: Vector2;
    description: string;
  
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, description: string = ""){
      this.hp = hp;
      this.maxHp = maxHp;
      this.symbol = symbol;
      this.name = name;
      this.position = position;
      this.description = description;
    }
  }

export default CombatEntity;