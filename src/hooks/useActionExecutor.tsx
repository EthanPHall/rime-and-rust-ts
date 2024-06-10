import { useState, useEffect, useRef } from 'react';
import CombatMapData from '../classes/combat/CombatMapData';
import CombatAction, { CombatActionWithRepeat } from '../classes/combat/CombatAction';
import { exec } from 'child_process';
import IAnimator, { IAnimationCleanup } from '../classes/animation/IAnimator';
import AnimationDetails from '../classes/animation/AnimationDetails';
import IActionExecutor from '../classes/combat/IActionExecutor';
import TurnManager from '../classes/combat/TurnManager';
import CombatHazard from '../classes/combat/CombatHazard';
import CombatEntity from '../classes/combat/CombatEntity';
import CombatPlayer from '../classes/combat/CombatPlayer';
import CombatEnemy from '../classes/combat/CombatEnemy';

enum ActionSteps{
    ANIMATION,
    ACTION,
    HAZARD,
    DEBUG
}

const useActionExecutor = (
    map: CombatMapData, 
    comboList:CombatActionWithRepeat[], 
    setComboList:(newList:CombatActionWithRepeat[]) => void, 
    animator: IAnimator, 
    turnManager:TurnManager,
    hazards:CombatHazard[],
    updateEntity:(id: number, newEntity: CombatEntity) => void,
    refreshMap: () => void
):IActionExecutor => {
    const ACTION_DELAY = 200;
    const DEBUG_DELAY = 4000;

    const currentStep = useRef(ActionSteps.ACTION);
    
    const [executing, setExecuting] = useState(false);

    const actionIndex = useRef(0);
    const animationCleanupObject = useRef<IAnimationCleanup | null>(null);

    const standbyForAction = useRef(false);
    const standbyForAnimation = useRef(false);
    const standbyForAnimationCleanup = useRef(false);
    const standbyForDebug = useRef(false);

    const hazardsDidAffectEntities = useRef(false);

    useEffect(() => {
    }, [comboList])

    function isExecuting():boolean {
        return executing;
    }

    function animateAndExecute(action: CombatActionWithRepeat, lastAction: boolean = false):void{
        
        let toAnimate: AnimationDetails[][] = action.combatAction.getAnimations();
        if(lastAction){
            toAnimate = toAnimate.map((animationSet) => 
                animationSet.filter((animation) => !animation.dontPlayIfLast)
            );
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

    function animateAndExecuteInBulk(actionsList:(CombatActionWithRepeat|null)[]):void{
        let toAnimate: AnimationDetails[][] = [];
        actionsList.forEach((action) => {
            if(action === null){
                return;
            }

            let animations: AnimationDetails[][] = action.combatAction.getAnimations();
            toAnimate = toAnimate.concat(animations);
        });

        standbyForAnimation.current = true;
        animator.animate(toAnimate).then((animationCleanup: IAnimationCleanup) => {
            standbyForAnimation.current = false;
            standbyForAction.current = true;
            setTimeout(() => {
                standbyForAction.current = false;
                standbyForAnimationCleanup.current = true;
                animationCleanupObject.current = animationCleanup;
                executeActionsInBulk(actionsList);
            }, ACTION_DELAY);
        });
    }

    function executeAction(action: CombatActionWithRepeat):void{
        action.combatAction.execute();

        if(currentStep.current === ActionSteps.ACTION){
            action.decrementRepeat();
            setComboList([...comboList]);

            if(action.repeat <= 0){
                actionIndex.current++;
            }
        }
    }
    function executeActionsInBulk(actionsList:(CombatActionWithRepeat|null)[]):void{
        let atLeastOneActionExecuted:boolean = false;
        
        actionsList.forEach((action) => {
            if(action === null){
                return;
            }

            atLeastOneActionExecuted = true;
            action.combatAction.execute();
        });

        if(!atLeastOneActionExecuted){
            refreshMap();
        }
    }

    function startExecution(){
        if(isExecuting() || comboList.length === 0){
            return;
        }

        setExecuting(true);
    }

    function endCurrentExecution(){
        setExecuting(false);
        setComboList([]);
        turnManager.advanceTurn();
    }

    function startNewActionStep(){
        if(actionIndex.current >= comboList.length){
            endCurrentExecution();
            return;
        }

        currentStep.current = ActionSteps.ACTION;

        const isLastAction:boolean = actionIndex.current === comboList.length - 1 && comboList[actionIndex.current].repeat <= 1;
        
        animateAndExecute(comboList[actionIndex.current], isLastAction);
    }

    function startNewHazardStep(){
        currentStep.current = ActionSteps.HAZARD;
        hazardsDidAffectEntities.current = false;

        
        //Foreach hazard, get an action, if it exists.
        //If it does, animate and execute it just like combo actions.
        //Actually, nevermind. The problem with using the existing animateAndExecute function is that
        //there will be a bunch of different promises and timeouts, all setting things like
        //the animation cleanup, possibly being out of sync, etc. So, call a new function that
        //can handle bulk animations and actions.
        const actionsList:(CombatActionWithRepeat|null)[] = hazards.map((hazard) => {
            const entity:CombatEntity|null = map.locations[hazard.position.y][hazard.position.x].entity;
            const action:CombatAction|null = hazard.getActionForNewEntityOnSpace(entity);
            if(action === null){
                return null;
            }
            else{
                hazardsDidAffectEntities.current = true;
                return new CombatActionWithRepeat(action);
            }
        });
        animateAndExecuteInBulk(actionsList);
    }

    useEffect(() => {
        if(!executing){
            return;
        }
        
        actionIndex.current = 0;

        startNewActionStep();
    }, [executing])

    useEffect(() => {
        if(!isExecuting() || standbyForAction.current || standbyForAnimation.current || standbyForDebug.current){
            return;
        }

        if(standbyForAnimationCleanup.current){
            animationCleanupObject.current?.cleanupAnimations(...animationCleanupObject.current.args)
            .then(() => {
                if(currentStep.current === ActionSteps.ACTION || (currentStep.current === ActionSteps.HAZARD && hazardsDidAffectEntities.current)){
                    startNewHazardStep();
                }else{
                    startNewActionStep();
                }
            });

            animationCleanupObject.current = null;
            standbyForAnimationCleanup.current = false;
            return;
        }
    }, [map])

    return {
        execute: startExecution,
        isExecuting: isExecuting,
    };
};

export default useActionExecutor;