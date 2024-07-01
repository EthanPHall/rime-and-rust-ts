import React, { FC, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting, { Sled } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionValuables, { ResourceFactory, ResourcePlusQuantity, ResourcePlusQuantityList, ResourcePlusQuantityUtil, ResourcesList } from '../CaravanSectionValuables/CaravanSectionValuables';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import { ResourceNamePlusQuantity } from '../CaravanSectionValuables/CaravanSectionValuables';
import { Resource } from '../CaravanSectionValuables/CaravanSectionValuables';
import useRefState from '../../../hooks/combat/useRefState';

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  const [resources, getResources, setResources] = useRefState<ResourcePlusQuantityList>({
    "scrap": {resource: ResourceFactory.createResource("scrap"), quantity: 1000},
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

  const [tradableList, setTradableList] = useState<ResourcesList>({
    "scrap": ResourceFactory.createResource("scrap"),
    "psychiumScrap": ResourceFactory.createResource("psychiumScrap"),
    "purePsychium": ResourceFactory.createResource("purePsychium"),
  });

  function modifyResources(resourceMods:ResourceNamePlusQuantity[]): boolean{
    let result:boolean = true;

    const newResourcesList: ResourcePlusQuantityList = {};
    const oldResourcesList: ResourcePlusQuantityList = getResources();

    //Copy current resources
    Object.keys(oldResourcesList).forEach((key) => {
      newResourcesList[key] = ResourcePlusQuantityUtil.create(key, oldResourcesList[key].quantity);
    });

    //Apply resource modifications and add new resources if they don't exist
    resourceMods.forEach((currentResourceMod) => {
      const key:string = currentResourceMod.resource;

      if(newResourcesList[key]){
        newResourcesList[key].quantity += currentResourceMod.quantity;
      }
      else{
        newResourcesList[key] = ResourcePlusQuantityUtil.create(currentResourceMod.resource, currentResourceMod.quantity);
      }
    });

    //If any resource is negative, return false and don't update resources
    Object.keys(newResourcesList).forEach((key) => {
      if(newResourcesList[key].quantity < 0){
        result = false;
      }
    });

    if(result){
      setResources(newResourcesList);
    }

    return result;
  }

  function exchangeResources(resourceMods:ResourceNamePlusQuantity[], newResource:Resource){
    const resourceModsNegative:ResourceNamePlusQuantity[] = resourceMods.map((resourceMod) => {
      if(resourceMod.quantity > 0){
        return {resource: resourceMod.resource, quantity: -resourceMod.quantity};
      }

      return resourceMod;
    });

    if(modifyResources(resourceModsNegative)){
      modifyResources([{resource: newResource.name, quantity: 1}]);
    }
  }

  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar></CaravanSectionNavBar>
          <CaravanSectionCrafting sleds={sleds} tradeResources={tradableList} exchangeResources={exchangeResources}></CaravanSectionCrafting>
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
