import React, { FC } from 'react';
import './ExplorationResourcesEntry.css';

interface ExplorationResourcesEntryProps {}

const ExplorationResourcesEntry: FC<ExplorationResourcesEntryProps> = () => (
  <div className="exploration-resources-entry" data-testid="exploration-resources-entry">
    <div className='resource-name'>Food:</div>
    <div className='amount-and-increments'>
      <div className='resource-amount'>0</div>
      <div className='increment-decrement'>
        <div className='resource-increment'>+</div>
        <div className='resource-decrement'>-</div>
      </div>
      <div className='increment-decrement'>
        <div className='resource-increment-large'>+</div>
        <div className='resource-decrement-large'>-</div>
      </div>
    </div>
  </div>
);

export default ExplorationResourcesEntry;
