import React, { FC } from 'react';
import './OptionSpeedToggle.css';

interface OptionSpeedToggleProps {}

const OptionSpeedToggle: FC<OptionSpeedToggleProps> = () => (
  <div className="option-speed-toggle" data-testid="option-speed-toggle">
    <button>Faster</button>
  </div>
);

export default OptionSpeedToggle;
