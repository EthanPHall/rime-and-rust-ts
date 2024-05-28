import { useState, useEffect, useRef } from 'react';
import CombatMapData from '../classes/combat/CombatMapData';
import CombatAction, { CombatActionWithRepeat } from '../classes/combat/CombatAction';
import { exec } from 'child_process';
import IAnimator, { IAnimationCleanup } from '../classes/animation/IAnimator';
import AnimationDetails from '../classes/animation/AnimationDetails';

interface IActionExecutor {
    execute(actions: CombatActionWithRepeat[]): void;
    isExecuting(): boolean;
}

const useActionExecutor = (map: CombatMapData, comboList:CombatActionWithRepeat[], setComboList:(newList:CombatActionWithRepeat[]) => void, animator: IAnimator, DEBUG_refreshMap: () => void):IActionExecutor => {
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

        // DEBUG_refreshMap();
        // new Promise<void>((resolve) => {
        //     standbyForAnimation.current = true;
        //     setTimeout(() => {
        //         resolve();
        //     }, ACTION_DELAY);
        // }).then(() => {
        //     standbyForAnimation.current = false;
        //     standbyForAction.current = true;
        //     setTimeout(() => {
        //         // animationCleanup.cleanupAnimations(...animationCleanup.args);

        //         standbyForAction.current = false;
        //         executeAction(action);
        //     }, ACTION_DELAY);
        // });

        standbyForAnimation.current = true;
        animator.animate(action.combatAction.getAnimations()).then((animationCleanup: IAnimationCleanup) => {
            standbyForAnimation.current = false;
            standbyForAction.current = true;
            setTimeout(() => {
                standbyForAction.current = false;
                executeAction(action);
                animationCleanup.cleanupAnimations(...animationCleanup.args);
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
    }, [executing])

    useEffect(() => {
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
    }, [map])

    return {
        execute: startExecution,
        isExecuting: isExecuting
    };
};

export default useActionExecutor;
export type { IActionExecutor };