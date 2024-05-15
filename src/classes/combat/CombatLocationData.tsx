class CombatLocationData{
  id: number;
  x: number;
  y: number;
  name: string;
  symbol: string;
  highlight: boolean;
  solid: boolean;
  constructor(id: number, x: number, y: number, name: string = "Combat Location", symbol: string = ".", highlight: boolean = false, solid: boolean = false){
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.symbol = symbol;
    this.highlight = highlight;
    this.solid = solid;
  }
}

export default CombatLocationData;