import React, { FC } from 'react';
import './CaravanParent.css';

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <div className='messages'>
          Messages
        </div>
        <div className='nav-rendered-composite'>
          <div className='nav-buttons'>
            Nav
          </div>
          <div className='rendered-section'>
            Rendered Section
          </div>
        </div>
        <div className='resources'>
          Resources
        </div>
        <div className='options'>
          Options
        </div>
      </div>
      </div>
  );
}

export default CaravanParent;
