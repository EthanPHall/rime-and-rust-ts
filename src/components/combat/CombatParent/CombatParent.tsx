import React, { FC } from 'react';
import './CombatParent.css';
import CombatMap from '../CombatMap/CombatMap';
import ActionsDisplay from '../ActionsDisplay/ActionsDisplay';
import LootDisplay from '../LootDisplay/LootDisplay';
import HpDisplay from '../HPDisplay/HPDisplay';
import TurnDisplay from '../TurnDisplay/TurnDisplay';
import ComboSection from '../ComboSection/ComboSection';
import ComponentSwitcher from '../ComponentSwitcher/ComponentSwitcher';

interface CombatParentProps {}

const CombatParent: FC<CombatParentProps> = () => (
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

export default CombatParent;
