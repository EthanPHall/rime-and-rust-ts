import React, { FC } from 'react';
import './HPDisplay.css';

interface HpDisplayProps {}

const HpDisplay: FC<HpDisplayProps> = () => (
  <div className="HPDisplay" data-testid="HpDisplay">
    HpDisplay Component
  </div>
);

export default HpDisplay;
