import React, { FC } from 'react';
import './HPDisplay.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface HpDisplayProps {}

const HpDisplay: FC<HpDisplayProps> = () => {
  const [hp, setHp] = React.useState<number>(2);
  const [maxHp, setMaxHp] = React.useState<number>(5);

  return (
  <div className="hp-display" data-testid="hp-display">
    HP:
    <div className="hp-bar" data-testid="hp-bar">
      <div className="hp-bar-fill" data-testid="hp-bar-fill" style={{width: `${(hp / maxHp) * 100}%`}}></div>
    </div>
    <div className="hp-text" data-testid="hp-text">{`${hp}/${maxHp}`}</div>
  </div>
);}

export default HpDisplay;
