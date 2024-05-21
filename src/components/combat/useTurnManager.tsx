import { useEffect, useRef, useState } from 'react';
import TurnManager from '../../classes/combat/TurnManager';
import TurnTaker from '../../classes/combat/TurnTaker';

const useTurnManager = (turnTakers: TurnTaker[]): TurnManager => {
    const currentIndex = useRef(0);
    const [currentTurnTaker, setCurrentTurnTaker] = useState(turnTakers[0]);

    useEffect(() => {
        turnTakers.forEach((turnTaker) => {
            turnTaker.advanceTurn = advanceTurn;
        });
    }, []);

    useEffect(() => {
        currentTurnTaker.startTurn();
    }, [currentTurnTaker]);
    
    const advanceTurn = () => {
        const nextIndex = (currentIndex.current + 1) % turnTakers.length;
        currentIndex.current = (nextIndex);
        setCurrentTurnTaker(turnTakers[currentIndex.current]);
    };

    return new TurnManager(currentTurnTaker, advanceTurn);
};

export default useTurnManager;