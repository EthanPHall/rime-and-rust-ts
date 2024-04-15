import React, { FC } from 'react';
import './HPDisplay.css';

interface HpDisplayProps {}

const HpDisplay: FC<HpDisplayProps> = () => (
  <div className="hp-display" data-testid="hp-display">
    HpDisplay Component
  </div>
);

export default HpDisplay;
