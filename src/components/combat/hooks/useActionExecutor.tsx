import { useState, useEffect, useRef } from 'react';
import CombatMapData from '../../../classes/combat/CombatMapData';
import CombatAction, { CombatActionWithRepeat } from '../../../classes/combat/CombatAction';
import { exec } from 'child_process';

interface IActionExecutor {
    execute(actions: CombatActionWithRepeat[]): void;
    isExecuting(): boolean;
}

const useActionExecutor = (map: CombatMapData, comboList:CombatActionWithRepeat[], setComboList:(newList:CombatActionWithRepeat[]) => void):IActionExecutor => {
    const ACTION_DELAY = 600;
    
    const [executing, setExecuting] = useState(false);

    const actionIndex = useRef(0);
    const delayInProgress = useRef(false);

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
        if(!isExecuting() || delayInProgress.current){
            return;
        }

        delayInProgress.current = true;
        setTimeout(() => {
            delayInProgress.current = false;
            if(actionIndex.current < comboList.length){
                executeAction(comboList[actionIndex.current]);
            } else {
                setComboList([]);
                setExecuting(false);
            }
        }, ACTION_DELAY);

    }, [map])

    return {
        execute: startExecution,
        isExecuting: isExecuting
    };
};

export default useActionExecutor;
export type { IActionExecutor };