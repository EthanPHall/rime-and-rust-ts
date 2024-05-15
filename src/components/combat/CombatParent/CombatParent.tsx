import React, { FC, useState } from 'react';
import './CombatParent.css';
import CombatMap from '../CombatMap/CombatMap';
import ActionsDisplay from '../ActionsDisplay/ActionsDisplay';
import LootDisplay from '../LootDisplay/LootDisplay';
import HpDisplay from '../HPDisplay/HPDisplay';
import TurnDisplay from '../TurnDisplay/TurnDisplay';
import ComboSection from '../ComboSection/ComboSection';
import ComponentSwitcher from '../ComponentSwitcher/ComponentSwitcher';
import CombatMapManager from '../../../classes/combat/CombatMapManager';
import CombatManager from '../../../classes/combat/CombatManager';
import CombatAction, { CombatActionWithRepeat, CombatActionWithUses } from '../../../classes/combat/CombatAction';

interface CombatParentProps {}

const CombatParent: FC<CombatParentProps> = () => {
  
  const [combatManager, setCombatManager] = useState(new CombatManager());
  const [mapManager, setMapManager] = useState(new CombatMapManager());

  const [comboList, setComboList] = useState<CombatActionWithRepeat[]>([]);
  const [playerActions, setPlayerActions] = useState<CombatActionWithUses[]>([
    new CombatActionWithUses(new CombatAction('Attack', true), 3),
    new CombatActionWithUses(new CombatAction('Block', false), 1),
    new CombatActionWithUses(new CombatAction('Move', true), 5),
  ]);

  function resetActionUses() : void{
    const newPlayerActions: CombatActionWithUses[] = [...playerActions];

    newPlayerActions.forEach(action => {
      action.uses = action.maxUses;
    });
    setPlayerActions(newPlayerActions);
  }
  function reduceActionUses(index: number) : void{
    const newPlayerActions: CombatActionWithUses[] = [...playerActions];
    newPlayerActions[index].uses--;
    setPlayerActions(newPlayerActions);
  }

  function addToComboList(newAction: CombatAction) {
    const newWithRepeat: CombatActionWithRepeat = new CombatActionWithRepeat(newAction);

    const lastAction: CombatActionWithRepeat = comboList[comboList.length - 1];
    if (lastAction && lastAction.areEquivalent(newWithRepeat)) {
      lastAction.incrementRepeat();
      setComboList([...comboList]);
      return;
    }

    setComboList([...comboList, newWithRepeat]);
  }

  return (
    <div className="combat-parent" data-testid="combat-parent">
        <div className='combat-parent-grid-parent'>
          <div className='combat-parent-map-actions-composite'>
            <CombatMap></CombatMap>
            <ActionsDisplay addToComboList={addToComboList} actions={playerActions} setActions={setPlayerActions} reduceActionUses={reduceActionUses}></ActionsDisplay>
          </div>
            {/* <LootDisplay></LootDisplay> */}
            <HpDisplay></HpDisplay>
            <TurnDisplay></TurnDisplay>
            <ComboSection comboList={comboList} setComboList={setComboList} resetActionUses={resetActionUses}></ComboSection>
            <ComponentSwitcher></ComponentSwitcher>
        </div>
    </div>
  );
}

export default CombatParent;
