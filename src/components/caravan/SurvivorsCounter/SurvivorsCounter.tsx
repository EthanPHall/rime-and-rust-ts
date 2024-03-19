import React, { FC } from 'react';
import './SurvivorsCounter.css';

interface SurvivorsCounterProps {}

const SurvivorsCounter: FC<SurvivorsCounterProps> = () => (
  <div className="SurvivorsCounter" data-testid="SurvivorsCounter">
    SurvivorsCounter Component
  </div>
);

export default SurvivorsCounter;
