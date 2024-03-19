import React, { FC } from 'react';
import './Sled.css';

interface SledProps {}

const Sled: FC<SledProps> = () => (
  <div className="Sled" data-testid="Sled">
    Sled Component
  </div>
);

export default Sled;
