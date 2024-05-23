import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";
import TurnTaker from "./TurnTaker";

abstract class CombatEnemy extends CombatEntity implements TurnTaker{
    combatEntity: CombatEntity = this;

    advanceTurn: () => void;
    
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

    constructor(id: number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, advanceTurn: () => void){
      super(id, hp, maxHp, symbol, name, position);
      this.advanceTurn = advanceTurn;
    }

    clone(): CombatEnemy{
      return new RustedShambler(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.advanceTurn);
    }
  }
  
  class RustedShambler extends CombatEnemy{
    constructor(id: number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, advanceTurn: () => void){
      super(id, hp, maxHp, symbol, name, position, advanceTurn);
    }
  }
  
  class RustedBrute extends CombatEnemy{
    constructor(id: number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, advanceTurn: () => void){
      super(id, hp, maxHp, symbol, name, position, advanceTurn);
    }
  }

export default CombatEnemy;
export { RustedShambler, RustedBrute };