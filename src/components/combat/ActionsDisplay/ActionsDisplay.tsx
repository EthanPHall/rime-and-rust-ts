import React, { FC, useEffect, useState } from 'react';
import './ActionsDisplay.css';
import ActionButton from '../ActionButton/ActionButton';
import CombatAction, { Attack, CombatActionWithRepeat, CombatActionWithUses, Move } from '../../../classes/combat/CombatAction';

interface ActionsDisplayProps {
  addToComboList: (newAction: CombatAction) => void;
  actions: CombatActionWithUses[];
  setActions: (actions: CombatActionWithUses[]) => void;
  reduceActionUses: (index:number) => void;
  actionsAreExecuting:()=>boolean;
  isTurnTakerPlayer:()=>boolean;
}

const MAX_ACTIONS = 8;

const ActionsDisplay: FC<ActionsDisplayProps> = ({addToComboList, actions, reduceActionUses, actionsAreExecuting, isTurnTakerPlayer}: ActionsDisplayProps) => {
  function buttonsShouldBeDisabled(): boolean {
    return actionsAreExecuting() || !isTurnTakerPlayer();
  }
  
  return (
  <div className="actions-display" data-testid="actions-display">
    {actions.map((action, index) => {
      if(index >= MAX_ACTIONS){
        return;
      }

      return <ActionButton addToComboList={addToComboList} action={action} actionIndex={index} reduceActionUses={reduceActionUses} buttonsShouldBeDisabled={buttonsShouldBeDisabled}></ActionButton>
    })}
  </div>
);}

export default ActionsDisplay;
