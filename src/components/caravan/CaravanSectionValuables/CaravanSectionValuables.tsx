import React, { FC } from 'react';
import './CaravanSectionValuables.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import { ResourceQuantity, SledDogQuantity } from '../../../classes/caravan/Item';

interface CaravanSectionValuablesProps {
  resources:ResourceQuantity[];
  dogs:SledDogQuantity[];
}

const CaravanSectionValuables: FC<CaravanSectionValuablesProps> = ({resources, dogs}) => {
  const dogAmount:number = dogs.map((dog) => dog.getQuantity()).reduce((a, b) => a + b, 0);

  return (<div className="caravan-section-valuables" data-testid="caravan-section-valuables">
      <SectionLabel sectionName='Resources'></SectionLabel>
      <div className='resources-list'>
        {
          <div className='resource-entry'>
            <div className='resource-name'>Sled Dogs</div>
            <div className='resource-amount'>{dogAmount}</div>
          </div>         
        }
        <div className='resources-separator'></div>
        {
          resources.map((currentResourceQuantity) => {
            return (
              <div key={`resource-entry-${currentResourceQuantity.getBaseResource().getName()}`} className='resource-entry'>
                <div className='resource-name'>{currentResourceQuantity.getBaseResource().getName()}</div>
                <div className='resource-amount'>{currentResourceQuantity.getQuantity()}</div>
              </div>    
            );
          })
        }
      </div>
    </div>
  );
}

export default CaravanSectionValuables;