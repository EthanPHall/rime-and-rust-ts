import { stat } from "fs";
import { useRef, useState } from "react";
import { Type } from "typescript";

function useRefState<T>(initialValue: T): [T, () => T, (newValue: T) => void] {
    const [state, setState] = useState(initialValue);
    const stateRef = useRef(state);

    function updateState(newValue: T) {
        stateRef.current = newValue;
        setState(newValue);
    }

    function getState() {
        return stateRef.current;
    }

    return [state, getState, updateState];
}

export default useRefState;