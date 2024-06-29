import React, { FC } from 'react';
import './CaravanSectionValuables.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import resourcesDefinition from '../../../data/caravan/resources.json';

type Resource = {
  name:string;
  craftingRecipe:Recipe[];
}

type Recipe = {resource: string, quantity: number};

type ResourcePlusQuantity = {
  resource:Resource;
  quantity:number;
}

class ResourceFactory{
  static createResource(name:string):Resource{
    const resourcesList:ResourcesList = resourcesDefinition;
    let newResource:Resource|undefined = resourcesList[name];

    if(newResource === undefined){
      newResource = {
        name: name,
        craftingRecipe: []
      }
    }

    return newResource;
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
export type { ResourcesList, ResourcePlusQuantityList, ResourcePlusQuantity, Resource, Recipe};
export { ResourceFactory };