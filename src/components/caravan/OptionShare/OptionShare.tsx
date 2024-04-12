import React, { FC } from 'react';
import './OptionShare.css';

interface OptionShareProps {}

const OptionShare: FC<OptionShareProps> = () => (
  <div className="option-share" data-testid="option-share">
    <button>Share</button>
  </div>
);

export default OptionShare;
