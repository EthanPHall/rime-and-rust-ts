import React, { FC } from 'react';
import './SledTitle.css';

interface SledTitleProps {}

const SledTitle: FC<SledTitleProps> = () => (
  <div className="SledTitle" data-testid="SledTitle">
    SledTitle Component
  </div>
);

export default SledTitle;
