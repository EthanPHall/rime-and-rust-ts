import React, { FC, useState } from 'react';
import './ComboSection.css';
import CombatAction, { Attack, Block, CombatActionWithRepeat, Move } from '../../../classes/combat/CombatAction';
import Directions from '../../../classes/utility/Directions';
import IActionExecutor from '../../../classes/combat/IActionExecutor';

interface ComboSectionProps {
  comboList: CombatActionWithRepeat[];
  setComboList: (comboList: CombatActionWithRepeat[]) => void;
  resetActionUses: () => void;
  actionExecutor: IActionExecutor;
  isTurnTakerPlayer: ()=>boolean;
}

const ComboSection: FC<ComboSectionProps> = ({comboList, setComboList, resetActionUses, actionExecutor, isTurnTakerPlayer}: ComboSectionProps) => {
  function cancelActions() {
    if(actionExecutor.isExecuting()) {
      return;
    }

    resetActionUses();
    setComboList([]);
  }

  function removeAction(index: number) {
    comboList.splice(index, 1);
    setComboList([...comboList]);
  }

  function executeActions() {
    if(!actionExecutor.isExecuting()) {
      actionExecutor.execute();
    }
  }

  function buttonsShouldBeDisabled(): boolean {
    return actionExecutor.isExecuting() || !isTurnTakerPlayer();
  }

  return (
    <div className="combo-section" data-testid="combo-section">
      <div className='combo-actions'>
        {
          comboList.map((action, index) => (
          <div key={index} className='combo-entry'>{`${action.combatAction.name} ${action.combatAction.direction != Directions.NONE ? action.combatAction.direction : ""} x${action.repeat}`}</div>
        ))}
      </div>
      <div className='confirm-cancel'>
        <button className={`confirm-button`} onClick={executeActions} disabled={buttonsShouldBeDisabled() ? true : false}>Confirm</button>
        <button className={`cancel-button`} onClick={cancelActions} disabled={buttonsShouldBeDisabled() ? true : false}>Cancel</button>
      </div>
    </div>
  );
}

export default ComboSection;
