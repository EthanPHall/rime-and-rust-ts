import React, { FC } from 'react';
import './CaravanSectionOptions.css';
import OptionCredits from '../OptionCredits/OptionCredits';
import OptionSpeedToggle from '../OptionSpeedToggle/OptionSpeedToggle';
import OptionShare from '../OptionShare/OptionShare';
import OptionRestart from '../OptionRestart/OptionRestart';
import OptionSave from '../OptionSave/OptionSave';
import { SaveObject } from '../../../context/misc/SettingsContext';

interface CaravanSectionOptionsProps {
  getSaveObject():SaveObject
}

const CaravanSectionOptions: FC<CaravanSectionOptionsProps> = (
  {getSaveObject}
) => (
  <div className="caravan-section-options" data-testid="caravan-section-options">
    <OptionCredits></OptionCredits>
    <OptionSpeedToggle></OptionSpeedToggle>
    <OptionShare></OptionShare>
    <OptionRestart></OptionRestart>
    <OptionSave getSaveObject={getSaveObject}></OptionSave>
  </div>
);

export default CaravanSectionOptions;
