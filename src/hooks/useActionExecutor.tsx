import { useState, useEffect, useRef } from 'react';
import CombatMapData from '../classes/combat/CombatMapData';
import CombatAction, { CombatActionWithRepeat } from '../classes/combat/CombatAction';
import { exec } from 'child_process';
import IAnimator, { IAnimationCleanup } from '../classes/animation/IAnimator';
import AnimationDetails from '../classes/animation/AnimationDetails';
import IActionExecutor from '../classes/combat/IActionExecutor';

const useActionExecutor = (map: CombatMapData, comboList:CombatActionWithRepeat[], setComboList:(newList:CombatActionWithRepeat[]) => void, animator: IAnimator):IActionExecutor => {
    const ACTION_DELAY = 200;
    const DEBUG_DELAY = 4000;
    
    const [executing, setExecuting] = useState(false);

    const actionIndex = useRef(0);
    const animationCleanupObject = useRef<IAnimationCleanup | null>(null);

    const standbyForAction = useRef(false);
    const standbyForAnimation = useRef(false);
    const standbyForAnimationCleanup = useRef(false);
    const standbyForDebug = useRef(false);

    function isExecuting():boolean {
        return executing;
    }

    function animateAndExecute(action: CombatActionWithRepeat, lastAction: boolean = false):void{
        
        let toAnimate: AnimationDetails[] = action.combatAction.getAnimations();
        if(lastAction){
            toAnimate = toAnimate.filter((animation) => !animation.dontPlayIfLast);
        }

        standbyForAnimation.current = true;
        animator.animate(toAnimate).then((animationCleanup: IAnimationCleanup) => {
            standbyForAnimation.current = false;
            standbyForAction.current = true;
            setTimeout(() => {
                standbyForAction.current = false;
                standbyForAnimationCleanup.current = true;
                animationCleanupObject.current = animationCleanup;
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
    }, [executing])

    useEffect(() => {
        if(!isExecuting() || standbyForAction.current || standbyForAnimation.current || standbyForDebug.current){
            return;
        }

        if(standbyForAnimationCleanup.current){
            animationCleanupObject.current?.cleanupAnimations(...animationCleanupObject.current.args)
            .then(() => {
                if(actionIndex.current >= comboList.length){
                    setExecuting(false);
                    setComboList([]);
                    return;
                }
        
                const isLastAction:boolean = actionIndex.current === comboList.length - 1 && comboList[actionIndex.current].repeat <= 1;
                
                animateAndExecute(comboList[actionIndex.current], isLastAction);        
            });
            animationCleanupObject.current = null;
            standbyForAnimationCleanup.current = false;
            return;
        }
    }, [map])

    return {
        execute: startExecution,
        isExecuting: isExecuting
    };
};

export default useActionExecutor;