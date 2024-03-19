import React, { FC } from 'react';
import './ExplanationHoverBox.css';

interface ExplanationHoverBoxProps {}

const ExplanationHoverBox: FC<ExplanationHoverBoxProps> = () => (
  <div className="ExplanationHoverBox" data-testid="ExplanationHoverBox">
    ExplanationHoverBox Component
  </div>
);

export default ExplanationHoverBox;
