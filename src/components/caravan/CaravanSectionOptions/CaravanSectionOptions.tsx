import React, { FC } from 'react';
import './CaravanSectionOptions.css';
import OptionCredits from '../OptionCredits/OptionCredits';
import OptionSpeedToggle from '../OptionSpeedToggle/OptionSpeedToggle';
import OptionShare from '../OptionShare/OptionShare';
import OptionRestart from '../OptionRestart/OptionRestart';
import OptionSave from '../OptionSave/OptionSave';
import { SaveObject } from '../../../context/misc/SettingsContext';
import OptionLoad from '../OptionLoad/OptionLoad';

interface CaravanSectionOptionsProps {
  getSaveObject():SaveObject;
  setLoadObject:React.Dispatch<React.SetStateAction<SaveObject | null>>;
}

const CaravanSectionOptions: FC<CaravanSectionOptionsProps> = (
  {
    getSaveObject,
    setLoadObject
  }
) => (
  <div className="caravan-section-options" data-testid="caravan-section-options">
    <OptionCredits></OptionCredits>
    <OptionSpeedToggle></OptionSpeedToggle>
    <OptionShare></OptionShare>
    <OptionRestart></OptionRestart>
    <OptionSave getSaveObject={getSaveObject}></OptionSave>
    <OptionLoad setLoadObject={setLoadObject}></OptionLoad>
  </div>
);

export default CaravanSectionOptions;
