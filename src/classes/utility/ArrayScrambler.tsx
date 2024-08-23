import { RNGFunction } from "../../context/misc/SettingsContext";

class ArrayScrambler{
    static scrambleArray<T>(array:T[], rngFunction:RNGFunction) : T[]{
        const scrambled = [];
        let validIndices:number[] = [];

        for(let i = 0; i < array.length; i++){
            validIndices.push(i);
        }

        
        for(let i = 0; i < array.length; i++){
            const indexRaw = rngFunction(0,validIndices.length-1);
            const chosenIndex = Math.floor(indexRaw);
            scrambled.push(array[validIndices[chosenIndex]]); 
            validIndices.splice(chosenIndex, 1);
        }
        
        return scrambled;
    }
}

export default ArrayScrambler;