import { MutableRefObject, useEffect, useRef, useState } from 'react';
import TurnManager from '../classes/combat/TurnManager';
import TurnTaker from '../classes/combat/TurnTaker';
import useRefState from './useRefState';

const useTurnManager = (): [TurnManager, ()=>boolean] => {
    const currentIndex = useRef(0);
    const turnTakersRefOfRef = useRef<MutableRefObject<TurnTaker[]>>(
        useRef<TurnTaker[]>([])
    );
    const [currentTurnTaker, getCurrentTurnTaker, setCurrentTurnTaker] = useRefState<TurnTaker|null>(null);

    useEffect(() => {
        currentTurnTaker?.startTurn();
    }, [currentTurnTaker]);
    
    const advanceTurn = () => {
        const turnTakers = turnTakersRefOfRef.current.current;

        for(let i = 0; i < turnTakers.length; i++){
            const nextIndex = (currentIndex.current + 1) % turnTakers.length;
            currentIndex.current = (nextIndex);
    
            if(turnTakers[currentIndex.current].canTakeTurn()){
                setCurrentTurnTaker(turnTakers[currentIndex.current]);
                return;
            }
        }

        throw new Error("No turn takers are alive.");
    };

    const finishSetup = (turnTakersRef: MutableRefObject<TurnTaker[]>) => {
        turnTakersRefOfRef.current = turnTakersRef;
        
        const turnTakers = turnTakersRefOfRef.current.current;

        currentIndex.current = 0;
        if(turnTakers.length > 0){
            setCurrentTurnTaker(turnTakers[currentIndex.current]);
        }
    };

    function isTurnTakerPlayer(): boolean{
        return currentIndex.current === 0;
    }

    return [new TurnManager(currentTurnTaker, advanceTurn, finishSetup), isTurnTakerPlayer];
};

export default useTurnManager;