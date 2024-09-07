import React, { FC } from 'react';
import './CombatPrepWindow.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import PrepWindowActionEntry from '../PrepWindowActionEntry/PrepWindowActionEntry';

interface CombatPrepWindowProps {}

const CombatPrepWindow: FC<CombatPrepWindowProps> = () => (
  <div className="combat-prep-window">
    <SectionLabel sectionName='Stats & Actions'></SectionLabel>
    <div className='remaining-action-selections'>Selections: 0/8</div>
    <div className='stats'>
      <div className='hpStat'>Max HP: 10</div>
      <div className='speedStat'>Speed: 5</div>
    </div>
    <div className='resources-separator'></div>
    <div className='actions'>
      <PrepWindowActionEntry></PrepWindowActionEntry>
    </div>
  </div>
);

export default CombatPrepWindow;
