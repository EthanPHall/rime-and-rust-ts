import React, { FC } from 'react';
import './OptionRestart.css';

interface OptionRestartProps {}

const OptionRestart: FC<OptionRestartProps> = () => (
  <div className="option-restart" data-testid="option-restart">
    <button>Restart</button>
  </div>
);

export default OptionRestart;
