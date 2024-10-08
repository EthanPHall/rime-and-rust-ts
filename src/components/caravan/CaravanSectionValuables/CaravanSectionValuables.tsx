import React, { FC, useEffect, useState } from 'react';
import './CaravanSectionValuables.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import { EquipmentQuantity, ResourceQuantity, SledDogQuantity } from '../../../classes/caravan/Item';

interface CaravanSectionValuablesProps {
  resources:ResourceQuantity[];
  equipment:EquipmentQuantity[];
  dogs:SledDogQuantity[];
  displayDogsInput?:boolean;
}

const CaravanSectionValuables: FC<CaravanSectionValuablesProps> = ({resources, equipment, dogs, displayDogsInput}) => {
  const [displayDogs] = useState(displayDogsInput === undefined ? true : displayDogsInput);

  const dogAmount:number = dogs.map((dog) => dog.getQuantity()).reduce((a, b) => a + b, 0);

  return (<div className="caravan-section-valuables" data-testid="caravan-section-valuables">
      <SectionLabel sectionName='Resources'></SectionLabel>
      <div className='resources-list'>
        {displayDogs &&
          <div className='resource-entry'>
            <div className='resource-name'>Sled Dogs</div>
            <div className='resource-amount'>{dogAmount}</div>
          </div>         
        }
        {displayDogs && <div className='resources-separator'></div>}
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
        {
          equipment.map((currentEquipmentQuantity) => {
            return (
              <div key={`resource-entry-${currentEquipmentQuantity.getBaseEquipment().getName()}`} className='resource-entry'>
                <div className='resource-name'>{currentEquipmentQuantity.getBaseEquipment().getName()}</div>
                <div className='resource-amount'>{currentEquipmentQuantity.getQuantity()}</div>
              </div>    
            );
          })
        }
      </div>
    </div>
  );
}

export default CaravanSectionValuables;