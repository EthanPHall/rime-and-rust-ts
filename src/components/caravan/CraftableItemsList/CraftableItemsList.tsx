import React, { FC } from 'react';
import './CraftableItemsList.css';

interface CraftableItemsListProps {}

const CraftableItemsList: FC<CraftableItemsListProps> = () => (
  <div className="CraftableItemsList" data-testid="CraftableItemsList">
    CraftableItemsList Component
  </div>
);

export default CraftableItemsList;
