import Vector2 from "../utility/Vector2";
import CombatAction from "./CombatAction";
import CombatEntity from "./CombatEntity";
import CombatMapData from "./CombatMapData";
import ConditionDebug from "./Conditions/ConditionDebug";
import ICondition from "./Conditions/ICondition";
import PlayerCombatStats from "./PlayerCombatStats";
import TurnTaker from "./TurnTaker";

class CombatPlayer extends CombatEntity implements TurnTaker{
    getAttackAction(): CombatAction | null {
      throw new Error("Method not implemented.");
    }
    getMoveAction(): CombatAction | null {
      throw new Error("Method not implemented.");
    }

    stats:PlayerCombatStats;

    startTurn(): void {
      // console.log(`${this.name} is starting their turn.`);
      this.conditions.forEach(condition => {
        if(!condition.evaluateShouldWearOff(this)){
          condition.executeCondition(this);
        }
      });
  
      this.resetActionUses();
    }
    endTurn(): void {
      // console.log(`${this.name} is ending their turn.`);
      
      //clean up conditions
      this.conditions = this.conditions.filter(condition => {
        return !condition.shouldWearOff(this);
      });
    }
    canTakeTurn(): boolean {
      return this.hp > 0;
    }

    
    combatEntity: CombatEntity = this;
    
    advanceTurn: () => void;
    resetActionUses:() => void;
    
    clone(): CombatPlayer {
      return new CombatPlayer(this.id, this.stats, this.symbol, this.name, this.position, this.getMap, this.advanceTurn, this.resetActionUses, this.hp, this.conditions);
    }

    constructor(
      id:number, 
      stats:PlayerCombatStats, 
      symbol: string, 
      name: string, 
      position: Vector2,
      getMap: ()=>CombatMapData,
      advanceTurn: () => void,
      resetActionUses:() => void,
      currentHp?:number,
      conditions: ICondition[] = []
    ){
      super(id, currentHp || stats.getHealth(), stats.getHealth(), symbol, name, position, getMap);
      this.advanceTurn = advanceTurn;
      this.resetActionUses = resetActionUses;
      this.stats = stats;

      if(conditions.length > 0){
        this.conditions = conditions;
      }
      else{
        this.conditions = [
          new ConditionDebug(this.id, this.id, 1),
        ];
      }
    }
  }

export default CombatPlayer;