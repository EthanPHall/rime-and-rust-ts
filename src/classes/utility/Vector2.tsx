class Vector2{
    x:number;
    y:number;
    constructor(x:number, y:number){
      this.x = x;
      this.y = y;
    }

    static add(a:Vector2, b:Vector2):Vector2{
      return new Vector2(a.x + b.x, a.y + b.y);
    }

    static equals(a:Vector2, b:Vector2){
      return a.x === b.x && a.y === b.y;
    }
  }

export default Vector2;