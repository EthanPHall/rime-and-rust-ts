import React, { FC } from 'react';
import './CraftingButton.css';

interface CraftingButtonProps {}

const CraftingButton: FC<CraftingButtonProps> = () => (
  <div className="CraftingButton" data-testid="CraftingButton">
    CraftingButton Component
  </div>
);

export default CraftingButton;
