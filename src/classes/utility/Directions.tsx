import Vector2 from "./Vector2";

enum Directions {
    UP="Up", DOWN="Down", LEFT="Left", RIGHT="Right", NONE="None"
};

class DirectionsUtility {
    static getOppositeDirection(direction: Directions): Directions{
        switch(direction){
            case Directions.UP:
                return Directions.DOWN;
            case Directions.DOWN:
                return Directions.UP;
            case Directions.LEFT:
                return Directions.RIGHT;
            case Directions.RIGHT:
                return Directions.LEFT;
            default:
                return Directions.NONE;
        }
    }

    static getVectorFromDirection(direction: Directions): Vector2{
        switch(direction){
            case Directions.UP:
                return new Vector2(0, -1);
            case Directions.DOWN:
                return new Vector2(0, 1);
            case Directions.LEFT:
                return new Vector2(-1, 0);
            case Directions.RIGHT:
                return new Vector2(1, 0);
            default:
                return new Vector2(0, 0);
        }
    }

    static getDirectionFromVector(vector: Vector2): Directions{
        if(vector.x === 0 && vector.y === 0){
            return Directions.NONE;
        }

        if(Math.abs(vector.x) > Math.abs(vector.y)){
            if(vector.x > 0){
                return Directions.RIGHT;
            } else {
                return Directions.LEFT;
            }
        } else {
            if(vector.y > 0){
                return Directions.DOWN;
            } else {
                return Directions.UP;
            }
        }
    }

    static getDirectionFromCoordinates(start: Vector2, end: Vector2): Directions{
        const vector: Vector2 = {x: end.x - start.x, y: end.y - start.y};

        return DirectionsUtility.getDirectionFromVector(vector);
    }
}

export default Directions;
export { DirectionsUtility };