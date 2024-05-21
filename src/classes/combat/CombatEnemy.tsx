import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";
import TurnTaker from "./TurnTaker";

abstract class CombatEnemy extends CombatEntity implements TurnTaker{
  
  advanceTurn: () => void;
  combatEntity: CombatEntity = this;
  
  startTurn(): void {
    console.log(`${this.name} is starting their turn.`);
    
    // TODO: Implement AI logic here
    setTimeout(() => {
      this.endTurn();
    }, 3000);
  }
  endTurn(): void {
    console.log(`${this.name} is ending their turn.`);
    this.advanceTurn();
  }

  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, advanceTurn: () => void){
      super(hp, maxHp, symbol, name, position);
      this.advanceTurn = advanceTurn;
    }
  }
  
  class RustedShambler extends CombatEnemy{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, advanceTurn: () => void){
      super(hp, maxHp, symbol, name, position, advanceTurn);
    }
  }
  
  class RustedBrute extends CombatEnemy{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, advanceTurn: () => void){
      super(hp, maxHp, symbol, name, position, advanceTurn);
    }
  }

export default CombatEnemy;
export { RustedShambler, RustedBrute };