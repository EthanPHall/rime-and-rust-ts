import { useState, useEffect, useRef } from 'react';
import CombatMapData from '../classes/combat/CombatMapData';
import CombatAction, { CombatActionWithRepeat } from '../classes/combat/CombatAction';
import { exec } from 'child_process';
import IAnimator from '../classes/animation/IAnimator';
import AnimationDetails from '../classes/animation/AnimationDetails';

interface IActionExecutor {
    execute(actions: CombatActionWithRepeat[]): void;
    isExecuting(): boolean;
}

const useActionExecutor = (map: CombatMapData, comboList:CombatActionWithRepeat[], setComboList:(newList:CombatActionWithRepeat[]) => void, animator: IAnimator):IActionExecutor => {
    const ACTION_DELAY = 300;
    
    const [executing, setExecuting] = useState(false);

    const actionIndex = useRef(0);
    const standbyForAction = useRef(false);
    const standbyForAnimation = useRef(false);

    function isExecuting():boolean {
        return executing;
    }

    function animateAndExecute(action: CombatActionWithRepeat, lastAction: boolean = false):void{
        
        let toAnimate: AnimationDetails[] = action.combatAction.getAnimations();
        if(lastAction){
            toAnimate = toAnimate.filter((animation) => !animation.dontPlayIfLast);
        }

        // standbyForAction.current = true;
        // setTimeout(() => {
        //     standbyForAction.current = false;
        //     executeAction(comboList[actionIndex.current]);
        // }, ACTION_DELAY);
        


        // new Promise<void>((resolve) => {
        //     console.log("In dummy Promise");
        //     setTimeout(() => {
        //         resolve();
        //         console.log("In dummy Promise timeout");
        //     }, ACTION_DELAY);
        // }).then(() => {
        //     console.log("In dummy Promise.then()");
        //     standbyForAction.current = true;
        //     setTimeout(() => {
        //         standbyForAction.current = false;
        //         executeAction(action);
        //     }, ACTION_DELAY);
        // });

        standbyForAnimation.current = true;
        animator.animate(action.combatAction.getAnimations()).then(() => {
            standbyForAnimation.current = false;
            standbyForAction.current = true;
            setTimeout(() => {
                standbyForAction.current = false;
                executeAction(action);
            }, ACTION_DELAY);
        });
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

        animateAndExecute(comboList[actionIndex.current]);

        // executeAction(comboList[actionIndex.current]);
    }, [executing])

    useEffect(() => {
        console.log(!isExecuting, standbyForAction.current, standbyForAnimation.current);
        if(!isExecuting() || standbyForAction.current || standbyForAnimation.current){
            return;
        }

        if(actionIndex.current >= comboList.length){
            setExecuting(false);
            setComboList([]);
            return;
        }

        const isLastAction:boolean = actionIndex.current === comboList.length - 1 && comboList[actionIndex.current].repeat <= 1;
        
        animateAndExecute(comboList[actionIndex.current], isLastAction);

        // standbyForAction.current = true;
        // setTimeout(() => {
        //     standbyForAction.current = false;
        //     executeAction(comboList[actionIndex.current]);
        // }, ACTION_DELAY);
    }, [map])

    return {
        execute: startExecution,
        isExecuting: isExecuting
    };
};

export default useActionExecutor;
export type { IActionExecutor };