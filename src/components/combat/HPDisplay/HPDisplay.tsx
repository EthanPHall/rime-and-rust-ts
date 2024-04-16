import React, { FC } from 'react';
import './HPDisplay.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface HpDisplayProps {}

const HpDisplay: FC<HpDisplayProps> = () => (
  <div className="hp-display" data-testid="hp-display">
    HP:
    <div className='hp'>
      <span>10</span>/<span>10</span>
    </div>
  </div>
);

export default HpDisplay;
