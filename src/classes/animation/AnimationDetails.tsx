import Directions from "../utility/Directions";

class AnimationDetails{
    animationName: string;
    animationLength: number;
    direction: Directions;
    entityToAnimateId: number;
    dontPlayIfLast: boolean;

    constructor(animationName: string, animationLength: number, direction: Directions, entityToAnimateId: number, dontPlayIfLast: boolean = false){
        this.animationName = animationName;
        this.animationLength = animationLength;
        this.direction = direction;
        this.entityToAnimateId = entityToAnimateId;
        this.dontPlayIfLast = dontPlayIfLast;
    }

    getFullname(): string{
        return `${this.animationName}-${this.direction}`;
    }
}

export default AnimationDetails;