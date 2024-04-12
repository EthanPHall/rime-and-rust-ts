import React, { FC } from 'react';
import './OptionCredits.css';

interface OptionCreditsProps {}

const OptionCredits: FC<OptionCreditsProps> = () => (
  <div className="option-credits" data-testid="option-credits">
    <button>Credits</button>
  </div>
);

export default OptionCredits;
