import React, { FC } from 'react';
import './Gradient.css';

interface GradientProps {}

const Gradient: FC<GradientProps> = () => (
  <div className="Gradient" data-testid="Gradient">
    Gradient Component
  </div>
);

export default Gradient;
