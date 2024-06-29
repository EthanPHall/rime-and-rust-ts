import React, { FC, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionValuables, { ResourceFactory, ResourcePlusQuantityList, ResourcesList } from '../CaravanSectionValuables/CaravanSectionValuables';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  const [resources, setResources] = useState<ResourcePlusQuantityList>({
    "scrap": {resource: ResourceFactory.createResource("scrap"), quantity: 10},
    "wood": {resource: ResourceFactory.createResource("wood"), quantity: 5},
  });

  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar></CaravanSectionNavBar>
          <CaravanSectionCrafting></CaravanSectionCrafting>
          {/* <CaravanSectionSleds></CaravanSectionSleds> */}
          {/* <CaravanSectionExploration></CaravanSectionExploration> */}
        </div>
        <CaravanSectionValuables resources={resources}></CaravanSectionValuables>
        <CaravanSectionOptions></CaravanSectionOptions>
      </div>
    </div>
  );
}

export default CaravanParent;
