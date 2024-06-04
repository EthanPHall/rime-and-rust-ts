import { useEffect, useRef, useState } from 'react';
import TurnManager from '../classes/combat/TurnManager';
import TurnTaker from '../classes/combat/TurnTaker';
import useRefState from './useRefState';

const useTurnManager = (): [TurnManager, ()=>boolean] => {
    const currentIndex = useRef(0);
    const [turnTakers, getTurnTakers, setTurnTakers] = useRefState<TurnTaker[]>([]);
    const [currentTurnTaker, getCurrentTurnTaker, setCurrentTurnTaker] = useRefState<TurnTaker|null>(null);

    useEffect(() => {
        currentIndex.current = 0;
        if(turnTakers.length > 0){
            setCurrentTurnTaker(turnTakers[currentIndex.current]);
        }
    }, [turnTakers]);

    useEffect(() => {
        currentTurnTaker?.startTurn();
    }, [currentTurnTaker]);
    
    const advanceTurn = () => {
        console.log(getTurnTakers().length);
        const nextIndex = (currentIndex.current + 1) % getTurnTakers().length;
        currentIndex.current = (nextIndex);
        setCurrentTurnTaker(getTurnTakers()[currentIndex.current]);
    };

    const finishSetup = (turnTakers: TurnTaker[]) => {
        setTurnTakers(turnTakers);
    };

    function isTurnTakerPlayer(): boolean{
        return currentIndex.current === 0;
    }

    return [new TurnManager(currentTurnTaker, advanceTurn, finishSetup), isTurnTakerPlayer];
};

export default useTurnManager;