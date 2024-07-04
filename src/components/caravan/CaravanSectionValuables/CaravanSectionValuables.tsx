import React, { FC } from 'react';
import './CaravanSectionValuables.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import { ResourceQuantity } from '../../../classes/caravan/Item';

interface CaravanSectionValuablesProps {
  resources:ResourceQuantity[];
}

const CaravanSectionValuables: FC<CaravanSectionValuablesProps> = ({resources}) => (
  <div className="caravan-section-valuables" data-testid="caravan-section-valuables">
    <SectionLabel sectionName='Resources'></SectionLabel>
    <div className='resources-list'>
      {
        resources.map((currentResourceQuantity) => {
          return (
            <div className='resource-entry'>
              <div className='resource-name'>{currentResourceQuantity.getResource().getName()}</div>
              <div className='resource-amount'>{currentResourceQuantity.getQuantity()}</div>
            </div>    
          );
        })
      }
    </div>
  </div>
);

export default CaravanSectionValuables;