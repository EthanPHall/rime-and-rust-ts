import React, { FC, useContext } from 'react';
import './OptionSave.css';
import { SettingsContext } from '../../../context/misc/SettingsContext';

interface OptionSaveProps {
  save():void;
}

const OptionSave: FC<OptionSaveProps> = ({save}) => {
  const settingsContext = useContext(SettingsContext);
  
  return (
  <div className="option-save" data-testid="option-save">
    <button onClick={() => {
      save()
    }}>Save</button>
  </div>
)};

export default OptionSave;
