import React, { FC } from 'react';
import './CaravanSectionCrafting.css';
import { Recipe, Resource } from '../CaravanSectionValuables/CaravanSectionValuables';

type Sled = {
  name: string;
  canCraftList: Resource[];
}

interface CaravanSectionCraftingProps {
  sleds: Sled[];
}

const CaravanSectionCrafting: FC<CaravanSectionCraftingProps> = ({sleds}) => {

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
                    <button>{resource1.name}</button>
                    {resource2 && <button>{resource2.name}</button>}
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
        <button>Item 1</button>
        <button>Item 2</button>
        <button>Item 3</button>
        <button>Item 4</button>
        <button>Item 5</button>
        <button>Item 6</button>
      </div>
    </div>
  </div>
  );
}

export default CaravanSectionCrafting;
export type { Sled };