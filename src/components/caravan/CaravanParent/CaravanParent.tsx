import React, { FC } from 'react';
import './CaravanParent.css';
import Messages from '../../messages/Messages/Messages';
import CaravanSectionCrafting from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionValuables from '../CaravanSectionValuables/CaravanSectionValuables';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <Messages></Messages>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar></CaravanSectionNavBar>
          <CaravanSectionCrafting></CaravanSectionCrafting>
          <CaravanSectionSleds></CaravanSectionSleds>
          <CaravanSectionExploration></CaravanSectionExploration>
        </div>
        <CaravanSectionValuables></CaravanSectionValuables>
        <CaravanSectionOptions></CaravanSectionOptions>
      </div>
    </div>
  );
}

export default CaravanParent;
