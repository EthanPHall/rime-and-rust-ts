import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting, { Sled, SledSeed } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionValuables, { ResourceFactory, ResourcePlusQuantity, ResourcePlusQuantityList, ResourcePlusQuantityUtil, ResourceUtils, ResourcesList } from '../CaravanSectionValuables/CaravanSectionValuables';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import { ResourceNamePlusQuantity } from '../CaravanSectionValuables/CaravanSectionValuables';
import { Resource } from '../CaravanSectionValuables/CaravanSectionValuables';
import useRefState from '../../../hooks/combat/useRefState';
import { ProgressionContext, ProgressionContextType, ProgressionFlags } from '../../../App';
import resourceData from '../../../data/caravan/resources.json';

enum CaravanSectionNames{
  CRAFTING="CRAFTING",
  SLEDS="SLEDS",
  EXPLORATION="EXPLORATION"
}

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  
  const progressionContext:ProgressionContextType = useContext(ProgressionContext);

  const [sectionToDisplay, getSectionToDisplay, setSectionToDisplay] = useRefState<CaravanSectionNames>(CaravanSectionNames.CRAFTING);
  
  const [resources, getResources, setResources] = useRefState<ResourcePlusQuantityList>({
    "Scrap": {resource: ResourceFactory.createResource("Scrap"), quantity: 1000},
    "Junk": {resource: ResourceFactory.createResource("Junk"), quantity: 1000},
  });
  useEffect(() => {
    const newFlags:ProgressionFlags = progressionContext.flags.clone();

    Object.keys(resources).forEach((key) => {
      newFlags.setFlag("Obtained " + key);
    });

    console.log(progressionContext);
    progressionContext.setFlags(newFlags);
  }, [resources]);

  //Define a type that contains a sled and then the
  //quantity of said sled. Use a Map to represent the Sled list as a whole
  type SledMapType = Map<string, SledPlusQuantity>;
  type SledPlusQuantity = {
    "sled":Sled,
    "quantity":number
  }
  type SledMapEntry =[    
    string,
    SledPlusQuantity
  ]
  function createSledMapEntry(sled:Sled, quantity:number):SledMapEntry{
    return [sled.name, {"sled": sled, "quantity": quantity}];
  }
  const [sleds, setSleds] = useState<SledMapType>(
    new Map().set(...createSledMapEntry(Sled.create("Scavenger Sled"), 1))
      .set(...createSledMapEntry(Sled.create("Forge Sled"), 1))
  );
  //To make the new sleds list play well with other components, make a function that translates the Map to an Array
  function sledsMapToArray():Sled[]{
    const sledsArray:Sled[] = [];
    sleds.forEach((value) => {
      sledsArray.push(value.sled);
    })

    return sledsArray;
  }

  //Load the tradable list with all resources that are tradeable
  const resourcesList:ResourcesList = resourceData;
  const tradableListDefault:ResourcesList = {};
  Object.keys(resourcesList).forEach((key) => {
    const currentResource = resourcesList[key];
    if(currentResource && ResourceUtils.isTradeable(currentResource)){
      tradableListDefault[key] = currentResource;
    }
  })
  const [tradableList, setTradableList] = useState<ResourcesList>(
    tradableListDefault
  );

  function isResourceNamePlusQuantityArray(
    arg:ResourceNamePlusQuantity[]|SledPlusQuantity[]
  ): arg is ResourceNamePlusQuantity[]{
    //This function doesn't hand;e when the array is of leangth 0, and the couple attempts I've made to change that
    //have failed. TODO: Try to make this handle 0 length arrays, but it's not a priority.

    return "resource" in arg[0];
  }
  
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
  function modifySleds(sledMods:SledPlusQuantity[]):boolean{
    //Copy sleds list
    const newSledsMap:SledMapType = new Map(sleds);
    
    //modify the new list
    sledMods.forEach((mod) => {
      const entry:SledPlusQuantity|undefined = newSledsMap.get(mod.sled.name);
      if(entry){
        entry.quantity += 1;
        newSledsMap.set(mod.sled.name, entry);
      }
      else{
        newSledsMap.set(mod.sled.name, {
          "sled": mod.sled,
          "quantity": mod.quantity
        })
      }
    });
    
    //find if any of the qunatities in the list are negative
    let someQuantityWasNegative:boolean = false;
    newSledsMap.forEach((value) => {
      someQuantityWasNegative = value.quantity < 0
      if(!someQuantityWasNegative){
        return;
      }
    });

    //If there are negative values, don't modify the sled list state, and return false
    if(someQuantityWasNegative){
      return false;
    }
    else{
      //Else, return true and modify list
      setSleds(newSledsMap);
      return true;
    }

  }

  function modifyItemQuantities(modifications:ResourceNamePlusQuantity[]|SledPlusQuantity[]): boolean{
    if(modifications.length > 0){
      if(isResourceNamePlusQuantityArray(modifications)){
        modifyResources(modifications);
      }
      else{
        modifySleds(modifications);
      }
    }

    return true;
  }

  function exchangeResources(toConsume:ResourceNamePlusQuantity[]|SledPlusQuantity[], toGenerate:ResourceNamePlusQuantity[]|SledPlusQuantity[]){
    //If teh consume list is empty, jump to generating
    if(toConsume.length == 0){
      modifyItemQuantities(toGenerate);
    }
    else if(isResourceNamePlusQuantityArray(toConsume)){
      const resourceModsNegative:ResourceNamePlusQuantity[] = toConsume.map((resourceMod) => {
        if(resourceMod.quantity > 0){
          return {resource: resourceMod.resource, quantity: -resourceMod.quantity};
        }
  
        return resourceMod;
      });
  
      if(modifyItemQuantities(resourceModsNegative)){
        modifyItemQuantities(toGenerate);
      }
    }
    else{
      const sledModsNegative:SledPlusQuantity[] = toConsume.map((sledMod) => {
        if(sledMod.quantity > 0){
          return {sled: sledMod.sled, quantity: -sledMod.quantity};
        }
  
        return sledMod;
      });
  
      if(modifyItemQuantities(sledModsNegative)){
        modifyItemQuantities(toGenerate);
      }
    }
  }

  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar getSectionBeingDisplayed={getSectionToDisplay} setSectionToDisplay={setSectionToDisplay}></CaravanSectionNavBar>
          
          {sectionToDisplay==CaravanSectionNames.CRAFTING && <CaravanSectionCrafting sleds={sledsMapToArray()} tradeResources={tradableList} exchangeResources={exchangeResources}></CaravanSectionCrafting>}
          {sectionToDisplay==CaravanSectionNames.SLEDS && <CaravanSectionSleds></CaravanSectionSleds>}
          {sectionToDisplay==CaravanSectionNames.EXPLORATION && <CaravanSectionExploration></CaravanSectionExploration>}
        </div>
        <CaravanSectionValuables resources={resources}></CaravanSectionValuables>
        <CaravanSectionOptions></CaravanSectionOptions>
      </div>
    </div>
  );
}

export default CaravanParent;
export {CaravanSectionNames}
