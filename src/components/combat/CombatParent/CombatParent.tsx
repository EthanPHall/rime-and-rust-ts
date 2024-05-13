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

interface CombatParentProps {}

const CombatParent: FC<CombatParentProps> = () => {
  
  const [combatManager, setCombatManager] = useState(new CombatManager());
  const [mapManager, setMapManager] = useState(new CombatMapManager());

  return (
    <div className="combat-parent" data-testid="combat-parent">
        <div className='combat-parent-grid-parent'>
          <div className='combat-parent-map-actions-composite'>
            <CombatMap></CombatMap>
            <ActionsDisplay></ActionsDisplay>
          </div>
            {/* <LootDisplay></LootDisplay> */}
            <HpDisplay></HpDisplay>
            <TurnDisplay></TurnDisplay>
            <ComboSection></ComboSection>
            <ComponentSwitcher></ComponentSwitcher>
        </div>
    </div>
  );
}

export default CombatParent;
