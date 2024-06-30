import React, { FC, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting, { Sled } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionValuables, { ResourceFactory, ResourcePlusQuantityList, ResourcesList } from '../CaravanSectionValuables/CaravanSectionValuables';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import { Recipe } from '../CaravanSectionValuables/CaravanSectionValuables';
import { Resource } from '../CaravanSectionValuables/CaravanSectionValuables';

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  const [resources, setResources] = useState<ResourcePlusQuantityList>({
    "scrap": {resource: ResourceFactory.createResource("scrap"), quantity: 10},
    "wood": {resource: ResourceFactory.createResource("wood"), quantity: 5},
  });

  const [sleds, setSleds] = useState<Sled[]>([
    {
      name: "Scavenger Sled",
      canCraftList: [ResourceFactory.createResource("scrap"), ResourceFactory.createResource("psychiumScrap")]
    },
    {
      name: "Sled 2",
      canCraftList: [
        ResourceFactory.createResource("scrap"), 
        ResourceFactory.createResource("psychiumScrap"), 
        ResourceFactory.createResource("purePsychium"),
        ResourceFactory.createResource("scrap"),
        ResourceFactory.createResource("scrap"),
      ]
    },
  ]); 

  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar></CaravanSectionNavBar>
          <CaravanSectionCrafting sleds={sleds}></CaravanSectionCrafting>
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
