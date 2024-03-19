import React, { FC } from 'react';
import './LootPicker.css';

interface LootPickerProps {}

const LootPicker: FC<LootPickerProps> = () => (
  <div className="LootPicker" data-testid="LootPicker">
    LootPicker Component
  </div>
);

export default LootPicker;
