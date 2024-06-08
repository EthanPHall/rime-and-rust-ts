import Directions from "../utility/Directions";
import Vector2 from "../utility/Vector2";

class AnimationDetails{
    animationName: string;
    animationLength: number;
    direction: Directions;
    entityToAnimateId: number;
    dontPlayIfLast: boolean;
    positionToAnimate:Vector2|null;

    constructor(animationName: string, animationLength: number, direction: Directions, entityToAnimateId: number, dontPlayIfLast: boolean = false, positionToAnimate:Vector2|null = null){
        this.animationName = animationName;
        this.animationLength = animationLength;
        this.direction = direction;
        this.entityToAnimateId = entityToAnimateId;
        this.dontPlayIfLast = dontPlayIfLast;
        this.positionToAnimate = positionToAnimate;
    }

    getFullname(): string{
        return `${this.animationName}-${this.direction}`;
    }
}

export default AnimationDetails;