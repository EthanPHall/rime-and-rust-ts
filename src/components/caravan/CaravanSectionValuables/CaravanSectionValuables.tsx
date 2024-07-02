import React, { FC } from 'react';
import './CaravanSectionValuables.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import resourcesDefinition from '../../../data/caravan/resources.json';
import { ProgressionFlags } from '../../../App';

type Resource = {
  name:string;
  craftingRecipe:Recipe;
  tradingRecipe:Recipe;
}


type Recipe = {
  costs:ResourceNamePlusQuantity[],
  flagsThatUnlockThis: string[]
}

type ResourceNamePlusQuantity = {resource: string, quantity: number};

type ResourcePlusQuantity = {
  resource:Resource;
  quantity:number;
}

class ResourceUtils{
  static createResource(name:string):Resource{
    const resourcesList:ResourcesList = resourcesDefinition;
    let newResource:Resource|undefined = resourcesList[name];

    if(newResource === undefined){
      newResource = this.createResource("Sample");
    }

    return newResource;
  }

  static stringifyCraftingRecipe(resource:Resource):string{
    return resource.craftingRecipe.costs.map((recipe) => {
      return recipe.resource + ": " + recipe.quantity;
    }).join("\n");
  }
  
  static stringifyTradingRecipe(resource:Resource):string{
    return resource.tradingRecipe.costs.map((recipe) => {
      return recipe.resource + ": " + recipe.quantity;
    }).join("\n");
  }

  static recipeFlagsAreSet(recipe:Recipe, progressionFlags:ProgressionFlags){
    let result = true;
    
    recipe.flagsThatUnlockThis.forEach((flagName) => {
      if(!progressionFlags.getFlag(flagName)){
        result = false;
      }
    });

    return result;
  }
}

class ResourcePlusQuantityUtil{
  static create(name:string, quantity:number):ResourcePlusQuantity{
    const resourcesList:ResourcesList = resourcesDefinition;
    let newResource:Resource|undefined = resourcesList[name];

    if(newResource === undefined){
      newResource = ResourceUtils.createResource("Sample");
    }

    return {resource: newResource, quantity: quantity};
  }
}

type ResourcesList = {[key:string]:Resource};
type ResourcePlusQuantityList = {[key:string]:ResourcePlusQuantity};

interface CaravanSectionValuablesProps {
  resources:ResourcePlusQuantityList;
}

const CaravanSectionValuables: FC<CaravanSectionValuablesProps> = ({resources}) => (


  <div className="caravan-section-valuables" data-testid="caravan-section-valuables">
    <SectionLabel sectionName='Resources'></SectionLabel>
    <div className='resources-list'>
      {
        Object.keys(resources).map((key) => {
          return (
            <div className='resource-entry'>
              <div className='resource-name'>{resources[key].resource.name}</div>
              <div className='resource-amount'>{resources[key].quantity}</div>
            </div>    
          );
        })
      }
    </div>
  </div>
);

export default CaravanSectionValuables;
export type { ResourcesList, ResourcePlusQuantityList, ResourcePlusQuantity, Resource, ResourceNamePlusQuantity};
export { ResourceUtils as ResourceFactory, ResourceUtils, ResourcePlusQuantityUtil};