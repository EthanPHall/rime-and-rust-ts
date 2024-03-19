import React, { FC } from 'react';
import './EmbarkButton.css';

interface EmbarkButtonProps {}

const EmbarkButton: FC<EmbarkButtonProps> = () => (
  <div className="EmbarkButton" data-testid="EmbarkButton">
    EmbarkButton Component
  </div>
);

export default EmbarkButton;
