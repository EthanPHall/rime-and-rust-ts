class CombatLocationData{
    x:number;
    y:number;
    symbol: string;

    constructor(x:number, y:number, symbol: string = "."){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
    }
}
export default CombatLocationData;