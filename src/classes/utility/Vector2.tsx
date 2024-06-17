class Vector2{
    x:number;
    y:number;
    constructor(x:number, y:number){
      this.x = x;
      this.y = y;
    }

    add(b:Vector2):Vector2{
      return new Vector2(this.x + b.x, this.y + b.y);
    }
    subtract(b:Vector2):Vector2{
      return new Vector2(this.x - b.x, this.y - b.y);
    }

    equals(b:Vector2){
      return this.x === b.x && this.y === b.y;
    }

    manhattanDistance(b:Vector2){
      return Math.abs(this.x - b.x) + Math.abs(this.y - b.y);
    }

    toString(){
      return `${this.x},${this.y}`;
    }

    static add(a:Vector2, b:Vector2):Vector2{
      return new Vector2(a.x + b.x, a.y + b.y);
    }
    static subtract(a:Vector2, b:Vector2):Vector2{
      return new Vector2(a.x - b.x, a.y - b.y);
    }

    static equals(a:Vector2, b:Vector2){
      return a.x === b.x && a.y === b.y;
    }

    static manhattanDistance(a:Vector2, b:Vector2){
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  }

export default Vector2;