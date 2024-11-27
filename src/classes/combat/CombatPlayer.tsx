import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";
import PlayerCombatStats from "./PlayerCombatStats";
import TurnTaker from "./TurnTaker";

class CombatPlayer extends CombatEntity implements TurnTaker{

    stats:PlayerCombatStats;

    startTurn(): void {
      // console.log(`${this.name} is starting their turn.`);
      this.resetActionUses();
    }
    endTurn(): void {
      // console.log(`${this.name} is ending their turn.`);
      this.advanceTurn();
    }
    canTakeTurn(): boolean {
      return this.hp > 0;
    }

    
    combatEntity: CombatEntity = this;
    
    advanceTurn: () => void;
    resetActionUses:() => void;
    
    clone(): CombatPlayer {
      return new CombatPlayer(this.id, this.stats, this.symbol, this.name, this.position, this.advanceTurn, this.resetActionUses, this.hp);
    }

    constructor(
      id:number, 
      stats:PlayerCombatStats,
      symbol: string, 
      name: string, 
      position: Vector2, 
      advanceTurn: () => void,
      resetActionUses:() => void,
      currentHp?:number 
    ){
      super(id, currentHp || stats.getHealth(), stats.getHealth(), symbol, name, position);
      this.advanceTurn = advanceTurn;
      this.resetActionUses = resetActionUses;
      this.stats = stats;
    }
  }

export default CombatPlayer;