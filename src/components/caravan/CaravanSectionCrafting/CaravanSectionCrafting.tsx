import React, { FC } from 'react';
import './CaravanSectionCrafting.css';
import { ResourceNamePlusQuantity, Resource, ResourcePlusQuantityList, ResourceUtils, ResourcesList } from '../CaravanSectionValuables/CaravanSectionValuables';
import HoverButton from '../../misc/HoverButton/HoverButton';
import sleds from '../../../data/caravan/sleds.json';

type SledSeed = {
  name: string;
  canCraftList: string[];
  toGenerate: ResourceNamePlusQuantity[];
  toConsume: ResourceNamePlusQuantity[];
}

class SledSeeds{
  [key: string]: SledSeed;
}

class Sled{
  name: string;
  canCraftList: Resource[];
  toGenerate: ResourceNamePlusQuantity[];
  toConsume: ResourceNamePlusQuantity[];

  constructor(sledSeed:SledSeed){
    this.name = sledSeed.name;
    this.canCraftList = [];
    sledSeed.canCraftList.forEach((resourceName) => {
      this.canCraftList.push(ResourceUtils.createResource(resourceName));
    });
    this.toGenerate = sledSeed.toGenerate;
    this.toConsume = sledSeed.toConsume;
  }

  static create(sledName:string):Sled{
    const sledSeeds:SledSeeds = sleds;
    const sledSeed:SledSeed|undefined = sledSeeds[sledName];

    if(sledSeed){      
      return new Sled(sledSeed);
    }
    else{
      return new Sled(sledSeeds["Invalid Sled"]);
    }
  }
}

interface CaravanSectionCraftingProps {
  sleds: Sled[];
  tradeResources: ResourcesList;
  exchangeResources: (costs:ResourceNamePlusQuantity[], generates:ResourceNamePlusQuantity[]) => void;
}

const CaravanSectionCrafting: FC<CaravanSectionCraftingProps> = ({sleds, tradeResources, exchangeResources}) => {

  return (
  <div className="caravan-section-crafting" data-testid="caravan-section-crafting">
    <div className='grid-parent'>
      <div className='crafting-section'>
        {
          sleds.map((sled, index) => {
            let sledNameClass = 'sled-name';
            if(index == 0){
              sledNameClass += ' first';
            }

            return (
            <div className='sled-crafting-section'>
              <div className={sledNameClass}>{sled.name}</div>
              {sled.canCraftList.map((resource1, index) => {
                if(index % 2 != 0) return;
                
                const resource2:Resource|undefined = sled.canCraftList?.[index + 1];

                return (
                  <div className='sled-crafting-recipes'>
                    <HoverButton 
                      buttonText={resource1.name} 
                      popupText={ResourceUtils.stringifyCraftingRecipe(resource1)} 
                      onClick={() => {exchangeResources(resource1.craftingRecipe, [{resource:resource1.name, quantity:1}])}}
                    ></HoverButton>
                    {resource2 && 
                      <HoverButton
                        buttonText={resource2.name}
                        popupText={ResourceUtils.stringifyCraftingRecipe(resource2)}
                        onClick={() => {exchangeResources(resource2.craftingRecipe, [{resource:resource2.name, quantity:1}])}}
                      ></HoverButton>}
                  </div>
                );
              })}
            </div>
            )
          })
        }
      </div>
      <div className='trade-section'>
        <div className='trade-section-title'>
          Trade
        </div>
        {
          Object.keys(tradeResources).map((key) => {
            return (
              <HoverButton
                buttonText={tradeResources[key].name}
                popupText={ResourceUtils.stringifyTradingRecipe(tradeResources[key])}
                onClick={() => {exchangeResources(tradeResources[key].tradingRecipe, [{resource:tradeResources[key].name, quantity: 1}])}}
              ></HoverButton>
            );})
        }
      </div>
    </div>
  </div>
  );
}

export default CaravanSectionCrafting;
export { Sled };
export type { SledSeed };