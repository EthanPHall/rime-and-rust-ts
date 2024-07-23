import Vector2 from "../utility/Vector2";

class DifficultyBrackets{
    brackets:Vector2[];
    
    constructor(maxDistance:number, numberOfBrackets:number){
        const bracketSize = maxDistance / numberOfBrackets;
        this.brackets = [];

        for(let i = 0; i < numberOfBrackets; i++){
            if(i == numberOfBrackets - 1){
                const newBracket = new Vector2(bracketSize*i, Infinity);
                this.brackets.push(newBracket);
            }
            else if(i == 0){
                const newBracket = new Vector2(-Infinity, bracketSize*(i+1));
                this.brackets.push(newBracket);
            }
            else{
                const newBracket = new Vector2(bracketSize*i, bracketSize*(i+1));
                this.brackets.push(newBracket);
            }
        }
    }

    getDifficultyBracket(distance:number):number{
        let result:number|undefined = undefined;

        this.brackets.forEach((bracket, i) => {
            if(bracket.x <= distance && distance < bracket.y){
                result = i;
                return;
            }
        })

        return result ? result : 0;
    }
}

export default DifficultyBrackets;