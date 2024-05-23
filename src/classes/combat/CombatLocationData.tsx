import CombatEntity from "./CombatEntity";

class CombatLocationData{
  x: number;
  y: number;
  name: string;
  symbol: string;
  highlight: boolean;
  solid: boolean;
  entity: CombatEntity | null = null;

  constructor(x: number, y: number, name: string = "Combat Location", symbol: string = ".", highlight: boolean = false, solid: boolean = false){
    this.x = x;
    this.y = y;
    this.name = name;
    this.symbol = symbol;
    this.highlight = highlight;
    this.solid = solid;
  }
}

export default CombatLocationData;