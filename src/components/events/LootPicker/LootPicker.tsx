import React, { FC } from 'react';
import './LootPicker.css';

interface LootPickerProps {}

const LootPicker: FC<LootPickerProps> = () => (
  <div className="loot-picker" data-testid="loot-picker">
    <div className='loot-entries'>
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
