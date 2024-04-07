import React, { FC } from 'react';
import './CaravanSectionCrafting.css';

interface CaravanSectionCraftingProps {}

const CaravanSectionCrafting: FC<CaravanSectionCraftingProps> = () => (
  <div className="caravan-section-crafting" data-testid="caravan-section-crafting">
    <div className='grid-parent'>
      <div className='crafting-section'>
        <div className='sled-crafting-section'>
          <div className='sled-name first'>Sled Name</div>
          <div className='sled-crafting-recipes'>
            <button>Item 1</button>
            <button>Item 2</button>
          </div>
          <div className='sled-crafting-recipes'>
            <button>Item 3</button>
            <button>Item 4</button>
          </div>
        </div>
        <div className='sled-crafting-section'>
          <div className='sled-name'>Sled Name</div>
          <div className='sled-crafting-recipes'>
            <button>Item 1</button>
            <button>Item 2</button>
            {/* <button>Item 3</button>
            <button>Item 4</button> */}
          </div>
        </div>
        <div className='sled-crafting-section'>
          <div className='sled-name first'>Sled Name</div>
          <div className='sled-crafting-recipes'>
            <button>Item 1</button>
            <button>Item 2</button>
          </div>
          <div className='sled-crafting-recipes'>
            <button>Item 3</button>
            <button>Item 4</button>
          </div>
        </div>
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

export default CaravanSectionCrafting;
