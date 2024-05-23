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

    clone(): CombatEntity {
      return new CombatPlayer(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position);
    }

    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
      super(id, hp, maxHp, symbol, name, position);
    }
  }

export default CombatPlayer;