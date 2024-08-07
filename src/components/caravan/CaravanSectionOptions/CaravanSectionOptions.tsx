import React, { FC } from 'react';
import './CaravanSectionOptions.css';
import OptionCredits from '../OptionCredits/OptionCredits';
import OptionSpeedToggle from '../OptionSpeedToggle/OptionSpeedToggle';
import OptionShare from '../OptionShare/OptionShare';
import OptionRestart from '../OptionRestart/OptionRestart';
import OptionSave from '../OptionSave/OptionSave';

interface CaravanSectionOptionsProps {
  save():void;
}

const CaravanSectionOptions: FC<CaravanSectionOptionsProps> = (
  {save}
) => (
  <div className="caravan-section-options" data-testid="caravan-section-options">
    <OptionCredits></OptionCredits>
    <OptionSpeedToggle></OptionSpeedToggle>
    <OptionShare></OptionShare>
    <OptionRestart></OptionRestart>
    <OptionSave save={save}></OptionSave>
  </div>
);

export default CaravanSectionOptions;
