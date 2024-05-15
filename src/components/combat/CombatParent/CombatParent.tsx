import React, { FC, useMemo, useState } from 'react';
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
import CombatMapData from '../../../classes/combat/CombatMapData';
import AreaOfEffect from '../../../classes/combat/AreaOfEffect';
import Directions from '../../../classes/utility/Directions';

interface CombatParentProps {}

const CombatParent: FC<CombatParentProps> = () => {
  const [comboList, setComboList] = useState<CombatActionWithRepeat[]>([]);
  const [playerActions, setPlayerActions] = useState<CombatActionWithUses[]>([
    new CombatActionWithUses(new CombatAction('Attack', true), 3),
    new CombatActionWithUses(new CombatAction('Block', false), 1),
    new CombatActionWithUses(new CombatAction('Move', true), 5),
  ]);

  const [map, setMap] = useState<CombatMapData>(new CombatMapData(15, 15));
  const [aoeToDisplay, setAoeToDisplay] = useState<AreaOfEffect|null>(
    new AreaOfEffect(3, Directions.RIGHT, 1, true)
  );

  useMemo(() => {
    map.locations[7][8].solid = true;
    map.locations[7][8].symbol = "#";
    map.locations[7][3].symbol = "E";
    map.locations[7][9].symbol = "E";
    map.locations[7][7].symbol = "@";

  }, []);

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
            <CombatMap map={map} setMap={setMap} aoeToDisplay={aoeToDisplay}></CombatMap>
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
