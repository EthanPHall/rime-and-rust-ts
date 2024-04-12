import React, { FC } from 'react';
import './OptionSave.css';

interface OptionSaveProps {}

const OptionSave: FC<OptionSaveProps> = () => (
  <div className="option-save" data-testid="option-save">
    <button>Save</button>
  </div>
);

export default OptionSave;
