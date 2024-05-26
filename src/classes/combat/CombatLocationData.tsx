import CombatEntity from "./CombatEntity";

class CombatLocationData{
  x: number;
  y: number;
  name: string;
  symbol: string;
  highlight: boolean;
  solid: boolean;
  entity: CombatEntity | null;
  animationList: string[];

  constructor(x: number, y: number, name: string = "Combat Location", symbol: string = ".", highlight: boolean = false, solid: boolean = false, entity: CombatEntity | null = null, animationList: string[] = []){
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