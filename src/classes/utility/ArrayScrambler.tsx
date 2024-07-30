class ArrayScrambler{
    static scrambleArray<T>(array:T[]) : T[]{
        const scrambled = [];
        let validIndices:number[] = [];

        for(let i = 0; i < array.length; i++){
            validIndices.push(i);
        }

        
        for(let i = 0; i < array.length; i++){
            const indexRaw = Math.random() * validIndices.length;
            const chosenIndex = Math.floor(indexRaw);
            scrambled.push(array[validIndices[chosenIndex]]); 
            validIndices.splice(chosenIndex, 1);
        }
        
        return scrambled;
    }
}

export default ArrayScrambler;