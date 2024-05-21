import React, { FC } from 'react';
import './HPDisplay.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface HpDisplayProps {
  hp: number;
  maxHp: number;
}

const HpDisplay: FC<HpDisplayProps> = ({hp, maxHp}) => {
  return (
  <div className="hp-display" data-testid="hp-display">
    HP:
    <div className="hp-text" data-testid="hp-text">{`${hp}/${maxHp}`}</div>
  </div>
);}

export default HpDisplay;
