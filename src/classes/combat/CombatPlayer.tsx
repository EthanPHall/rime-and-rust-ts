import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";
import TurnTaker from "./TurnTaker";

class CombatPlayer extends CombatEntity implements TurnTaker{
    startTurn(): void {
      console.log(`${this.name} is starting their turn.`);
      this.resetActionUses();
    }
    endTurn(): void {
      console.log(`${this.name} is ending their turn.`);
      this.advanceTurn();
    }

    
    combatEntity: CombatEntity = this;
    
    advanceTurn: () => void;
    resetActionUses:() => void;
    
    clone(): CombatPlayer {
      return new CombatPlayer(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.advanceTurn, this.resetActionUses);
    }

    constructor(
      id:number, 
      hp: number, 
      maxHp: number, 
      symbol: string, 
      name: string, 
      position: Vector2, 
      advanceTurn: () => void,
      resetActionUses:() => void
    ){
      super(id, hp, maxHp, symbol, name, position);
      this.advanceTurn = advanceTurn;
      this.resetActionUses = resetActionUses;
    }
  }

export default CombatPlayer;