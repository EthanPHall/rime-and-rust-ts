import React, { FC } from 'react';
import './LootPicker.css';
import { UniqueItemQuantitiesList } from '../../../classes/caravan/Item';

interface LootPickerProps {
  loot:UniqueItemQuantitiesList
}

const LootPicker: FC<LootPickerProps> = (
  {loot}
) => (
  <div className="loot-picker" data-testid="loot-picker">
    <div className='loot-entries'>
      {loot.getListCopy().map((itemQuantity) => {
        return (
          <></>
        )
      })}
      <div className='loot-entry'>
        <div>Item Name, #:</div>
        <div>+</div>
        <div>-</div>
      </div>
      <div className='loot-entry'>
        <div>Item Name, #:</div>
        <div>+</div>
        <div>-</div>
      </div>
      <div className='loot-entry'>
        <div>Item Name, #:</div>
        <div>+</div>
        <div>-</div>
      </div>
      <div className='loot-entry'>
        <div>Item Name, #:</div>
        <div>+</div>
        <div>-</div>
      </div>
    </div>
  </div>
);

export default LootPicker;
