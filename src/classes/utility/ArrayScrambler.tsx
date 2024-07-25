class ArrayScrambler{
    static scrambleArray<T>(array:T[]) : T[]{
        const scrambled = [];
        const validIndices:number[] = [];
        for(let i = 0; i < array.length; i++){
            validIndices.push(i);
        }
        for(let i = 0; i < array.length; i++){
            const chosenIndex = Math.floor(Math.random() * validIndices.length);
            scrambled.push(array[chosenIndex]);
            validIndices.filter((index) => {
                return index != chosenIndex;
            })
        }
        
        return scrambled;
    }
}

export default ArrayScrambler;