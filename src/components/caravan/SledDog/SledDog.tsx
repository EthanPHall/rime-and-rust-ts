import React, { FC } from 'react';
import './SledDog.css';

interface SledDogComponentProps {}

const SledDogComponent: FC<SledDogComponentProps> = () => (
  <div className="SledDog" data-testid="SledDog">
    SledDog Component
  </div>
);

export default SledDogComponent;
