import React, { FC } from 'react';
import './InventoryPicker.css';

interface InventoryPickerProps {}

const InventoryPicker: FC<InventoryPickerProps> = () => (
  <div className="InventoryPicker" data-testid="InventoryPicker">
    InventoryPicker Component
  </div>
);

export default InventoryPicker;
