import React, { FC, useState } from 'react';
import './ComboSection.css';
import CombatAction, { Attack, Block, CombatActionWithRepeat, Move } from '../../../classes/combat/CombatAction';
import Directions from '../../../classes/utility/Directions';

interface ComboSectionProps {
  comboList: CombatActionWithRepeat[];
  setComboList: (comboList: CombatActionWithRepeat[]) => void;
  resetActionUses: () => void;
}

const ComboSection: FC<ComboSectionProps> = ({comboList, setComboList, resetActionUses}: ComboSectionProps) => {
  const EXECUTION_DELAY = 600;

  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  function cancelActions() {
    resetActionUses();
    setComboList([]);
  }

  function removeAction(index: number) {
    comboList.splice(index, 1);
    setComboList([...comboList]);
  }

  function executeActions() {
    if (isExecuting) {
      return;
    }

    //I think in the final project, we can use global context to make sure other components know that we are executing
    setIsExecuting(true);

    let delay = 0;

    for(let i = 0; i < comboList.length; i++) {
      const action:CombatActionWithRepeat = comboList[i];
      for(let j = 0; j < action.repeat; j++) {
        setTimeout(() => {
          action.combatAction.execute();
          action.decrementRepeat();
          setComboList([...comboList]);
        }, delay);

        delay += EXECUTION_DELAY;
      }
    }

    setTimeout(() => {
      setComboList([]);
      setIsExecuting(false);
    }, delay);
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
        <button className='confirm-button' onClick={executeActions}>Confirm</button>
        <button className='cancel-button' onClick={cancelActions}>Cancel</button>
      </div>
    </div>
  );
}

export default ComboSection;
