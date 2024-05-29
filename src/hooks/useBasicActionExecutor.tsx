import { useState, useEffect, useRef } from 'react';
import CombatMapData from '../classes/combat/CombatMapData';
import { CombatActionWithRepeat } from '../classes/combat/CombatAction';
import IActionExecutor from '../classes/combat/IActionExecutor';

const useBasicActionExecutor = (map: CombatMapData, comboList:CombatActionWithRepeat[], setComboList:(newList:CombatActionWithRepeat[]) => void):IActionExecutor => {
    const ACTION_DELAY = 400;
    
    const [executing, setExecuting] = useState(false);

    const actionIndex = useRef(0);

    const standbyForAction = useRef(false);

    function isExecuting():boolean {
        return executing;
    }

    function executeAction(action: CombatActionWithRepeat):void{
        action.combatAction.execute();
        action.decrementRepeat();
        setComboList([...comboList]);

        if(action.repeat <= 0){
            actionIndex.current++;
        }
    }

    function startExecution(){
        if(isExecuting() || comboList.length === 0){
            return;
        }

        setExecuting(true);
    }

    useEffect(() => {
        if(!executing){
            return;
        }
        
        actionIndex.current = 0;

        executeAction(comboList[actionIndex.current]);
    }, [executing])

    useEffect(() => {
        if(!isExecuting() || standbyForAction.current){
            return;
        }

        standbyForAction.current = true;
        setTimeout(() => {
            standbyForAction.current = false;

            if(actionIndex.current >= comboList.length){
                setExecuting(false);
                setComboList([]);
                return;
            }
    
            executeAction(comboList[actionIndex.current]);            
        }, ACTION_DELAY);

    }, [map])

    return {
        execute: startExecution,
        isExecuting: isExecuting
    };
};

export default useBasicActionExecutor;