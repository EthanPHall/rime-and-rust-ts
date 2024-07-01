import React, { FC } from 'react';
import './CaravanSectionCrafting.css';
import { ResourceNamePlusQuantity, Resource, ResourcePlusQuantityList, ResourceUtils, ResourcesList } from '../CaravanSectionValuables/CaravanSectionValuables';
import HoverButton from '../../misc/HoverButton/HoverButton';

type Sled = {
  name: string;
  canCraftList: Resource[];
}

interface CaravanSectionCraftingProps {
  sleds: Sled[];
  tradeResources: ResourcesList;
  exchangeResources: (resourceMods:ResourceNamePlusQuantity[], newResource:Resource) => void;
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
                      onClick={() => {exchangeResources(resource1.craftingRecipe, resource1)}}
                    ></HoverButton>
                    {resource2 && 
                      <HoverButton
                        buttonText={resource2.name}
                        popupText={ResourceUtils.stringifyCraftingRecipe(resource2)}
                        onClick={() => {exchangeResources(resource2.craftingRecipe, resource2)}}
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
                onClick={() => {exchangeResources(tradeResources[key].tradingRecipe, tradeResources[key])}}
              ></HoverButton>
            );})
        }
      </div>
    </div>
  </div>
  );
}

export default CaravanSectionCrafting;
export type { Sled };