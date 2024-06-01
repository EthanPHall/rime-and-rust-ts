import AnimationDetails from "../animation/AnimationDetails";
import CombatEntity from "./CombatEntity";

class CombatLocationData{
  x: number;
  y: number;
  name: string;
  symbol: string;
  highlight: boolean;
  solid: boolean;
  entity: CombatEntity | null;
  animationList: AnimationDetails[];

  constructor(x: number, y: number, name: string = "Combat Location", symbol: string = ".", highlight: boolean = false, solid: boolean = false, entity: CombatEntity | null = null, animationList: AnimationDetails[] = []){
    this.x = x;
    this.y = y;
    this.name = name;
    this.symbol = symbol;
    this.highlight = highlight;
    this.solid = solid;
    this.entity = entity;
    this.animationList = animationList;
  }
}

export default CombatLocationData;