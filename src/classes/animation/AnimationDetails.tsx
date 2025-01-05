import Directions from "../utility/Directions";
import Vector2 from "../utility/Vector2";

class AnimationDetails{
    animationName: string;
    animationLength: number;
    direction: Directions;
    secondaryDirection: Directions|undefined;
    entityToAnimateId: number;
    dontPlayIfLast: boolean;
    positionToAnimate:Vector2|null;
    movementVector:Vector2|undefined;

    constructor(animationName: string, animationLength: number, direction: Directions, entityToAnimateId: number, dontPlayIfLast: boolean = false, positionToAnimate:Vector2|null = null, secondaryDirection: Directions|undefined = undefined, movementVector:Vector2|undefined = undefined){
        this.animationName = animationName;
        this.animationLength = animationLength;
        this.direction = direction;
        this.entityToAnimateId = entityToAnimateId;
        this.dontPlayIfLast = dontPlayIfLast;
        this.positionToAnimate = positionToAnimate;

        this.secondaryDirection = secondaryDirection;
        this.movementVector = movementVector;
    }

    getFullname(): string{
        return `${this.animationName}-${this.direction}`;
    }
}

export default AnimationDetails;