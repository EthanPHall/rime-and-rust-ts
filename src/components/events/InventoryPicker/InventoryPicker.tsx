import React, { FC } from 'react';
import './InventoryPicker.css';

interface InventoryPickerProps {}

const InventoryPicker: FC<InventoryPickerProps> = () => (
  <div className="inventory-picker" data-testid="inventory-picker">
    <div className='capacity-heading'>Capacity: #/#</div>
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

export default InventoryPicker;
