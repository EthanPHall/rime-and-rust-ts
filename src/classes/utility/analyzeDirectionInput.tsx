import Directions from "./Directions";

function analyzeDirectionInput(event:any):Directions {
    let direction = Directions.NONE;

    if (event.key === "ArrowUp" || event.key === "w") {
        direction = Directions.UP;
    }
    else if (event.key === "ArrowDown" || event.key === "s") {
        direction = Directions.DOWN;
    }
    else if (event.key === "ArrowLeft" || event.key === "a") {
        direction = Directions.LEFT;
    }
    else if (event.key === "ArrowRight" || event.key === "d") {
        direction = Directions.RIGHT;
    }
  
    return direction;
}

export default analyzeDirectionInput;