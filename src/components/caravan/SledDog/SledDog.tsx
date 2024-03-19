import React, { FC } from 'react';
import './SledDog.css';

interface SledDogProps {}

const SledDog: FC<SledDogProps> = () => (
  <div className="SledDog" data-testid="SledDog">
    SledDog Component
  </div>
);

export default SledDog;
