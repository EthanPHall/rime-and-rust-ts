import React, { FC } from 'react';
import './CaravanParent.css';

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => (
  <div className="CaravanParent" data-testid="CaravanParent">
    CaravanParent Component
  </div>
);

export default CaravanParent;
