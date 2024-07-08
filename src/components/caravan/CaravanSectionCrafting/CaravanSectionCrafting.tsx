import React, { FC, useContext } from 'react';
import './CaravanSectionCrafting.css';
import HoverButton from '../../misc/HoverButton/HoverButton';
import sleds from '../../../data/caravan/sleds.json';
import { ItemFactoryContext, ProgressionContext } from '../../../App';
import { IItem, ITradeManager, ItemSeed, Recipe, Resource, Sled, useTradeManagerProgressionBased } from '../../../classes/caravan/Item';

interface CaravanSectionCraftingProps {
  sleds: Sled[];
  tradeResources: IItem[];
  executeRecipe: (recipe:Recipe) => void;
}

const CaravanSectionCrafting: FC<CaravanSectionCraftingProps> = ({sleds, tradeResources, executeRecipe}) => {
  const progressionContext = useContext(ProgressionContext);
  const tradeManager:ITradeManager = useTradeManagerProgressionBased();

  const itemFactory = useContext(ItemFactoryContext);

  function getCraftableItems(){

  }

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
              <div className={sledNameClass}>{sled.getName()}</div>
              {sled.getCanCraftList().filter(
                (item) => {
                  return !item.convertToItem(itemFactory).isUnlocked(progressionContext.flags);
                }).map(
                  (itemSeed1:ItemSeed, index, filteredList) => 
                    {
                      const item1:IItem = itemSeed1.convertToItem(itemFactory);

                      if(index % 2 != 0) return;
                      
                      const item2:IItem|undefined = filteredList?.[index + 1]?.convertToItem(itemFactory);

                      // console.log(item1.getRecipe());

                      return (
                        <div className='sled-crafting-recipes'>
                          <HoverButton 
                            buttonText={item1.getName()} 
                            popupText={item1.getRecipe().convertToRecipe(itemFactory).stringifyCosts()} 
                            onClick={() => {executeRecipe(item1.getRecipe().convertToRecipe(itemFactory))}}
                          ></HoverButton>
                          {item2 && 
                            <HoverButton
                              buttonText={item2.getName()}
                              popupText={item2.getRecipe().convertToRecipe(itemFactory).stringifyCosts()}
                              onClick={() => {executeRecipe(item2.getRecipe().convertToRecipe(itemFactory))}}
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
          tradeResources.filter((item:IItem) => {
            return !item.isUnlocked(progressionContext.flags);
          }).map((item:IItem) => {
            return (
              <HoverButton
                buttonText={item.getName()}
                popupText={tradeManager.getTradeRecipe(item.getRecipe().convertToRecipe(itemFactory)).stringifyCosts()}
                onClick={() => {executeRecipe(tradeManager.getTradeRecipe(item.getRecipe().convertToRecipe(itemFactory)))}}
              ></HoverButton>
            );
          })
        }
      </div>
    </div>
  </div>
  );
}

export default CaravanSectionCrafting;
export { Sled };