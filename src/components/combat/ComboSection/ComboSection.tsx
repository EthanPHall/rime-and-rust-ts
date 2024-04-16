import React, { FC } from 'react';
import './ComboSection.css';

interface ComboSectionProps {}

const ComboSection: FC<ComboSectionProps> = () => (
  <div className="combo-section" data-testid="combo-section">
    <div className='combo-actions'>
      <div className='combo-entry'>Attack</div>
      <div className='combo-entry'>Block</div>
      <div className='combo-entry'>Attack</div>
      <div className='combo-entry'>Move Up <span>x3</span></div>
      <div className='combo-entry'>Move Left <span>x2</span></div>
    </div>
    <div className='confirm-cancel'>
      <button className='confirm-button'>Confirm</button>
      <button className='cancel-button'>Cancel</button>
    </div>
  </div>
);

export default ComboSection;
