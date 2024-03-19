import React, { FC } from 'react';
import './Overlay.css';

interface OverlayProps {}

const Overlay: FC<OverlayProps> = () => (
  <div className="Overlay" data-testid="Overlay">
    Overlay Component
  </div>
);

export default Overlay;
