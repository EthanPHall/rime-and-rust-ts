import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";
import TurnTaker from "./TurnTaker";

class CombatPlayer extends CombatEntity implements TurnTaker{
    startTurn(): void {
      console.log(`${this.name} is starting their turn.`);
    }
    endTurn(): void {
      console.log(`${this.name} is ending their turn.`);
      // console.log(this.advanceTurn);
      this.advanceTurn();
    }

    combatEntity: CombatEntity = this;

    advanceTurn: () => void = () => {};

    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
      super(hp, maxHp, symbol, name, position);
    }
  }

export default CombatPlayer;