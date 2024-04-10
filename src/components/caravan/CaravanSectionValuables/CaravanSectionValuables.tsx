import React, { FC } from 'react';
import './CaravanSectionValuables.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface CaravanSectionValuablesProps {}

const CaravanSectionValuables: FC<CaravanSectionValuablesProps> = () => (
  <div className="caravan-section-valuables" data-testid="caravan-section-valuables">
    <SectionLabel sectionName='Resources'></SectionLabel>
    <div className='resources-list'>
      <div className='resource-entry'>
        <div className='resource-name'>Resource Name</div>
        <div className='resource-amount'>999</div>
      </div>
      <div className='resource-entry'>
        <div className='resource-name'>R. Name</div>
        <div className='resource-amount'>9</div>
      </div>
      <div className='resource-entry'>
        <div className='resource-name'>Resource Name</div>
        <div className='resource-amount'>999</div>
      </div>
      <div className='resource-entry'>
        <div className='resource-name'>Resource Name</div>
        <div className='resource-amount'>999999</div>
      </div>
    </div>
  </div>
);

export default CaravanSectionValuables;
