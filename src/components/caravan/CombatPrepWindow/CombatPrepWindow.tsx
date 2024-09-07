import React, { FC } from 'react';
import './CombatPrepWindow.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface CombatPrepWindowProps {}

const CombatPrepWindow: FC<CombatPrepWindowProps> = () => (
  <div className="combat-prep-window">
    <SectionLabel sectionName='Stats & Actions'></SectionLabel>
  </div>
);

export default CombatPrepWindow;
