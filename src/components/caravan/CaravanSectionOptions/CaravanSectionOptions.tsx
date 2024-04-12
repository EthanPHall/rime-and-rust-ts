import React, { FC } from 'react';
import './CaravanSectionOptions.css';
import OptionCredits from '../OptionCredits/OptionCredits';
import OptionSpeedToggle from '../OptionSpeedToggle/OptionSpeedToggle';
import OptionShare from '../OptionShare/OptionShare';
import OptionRestart from '../OptionRestart/OptionRestart';
import OptionSave from '../OptionSave/OptionSave';

interface CaravanSectionOptionsProps {}

const CaravanSectionOptions: FC<CaravanSectionOptionsProps> = () => (
  <div className="caravan-section-options" data-testid="caravan-section-options">
    <OptionCredits></OptionCredits>
    <OptionSpeedToggle></OptionSpeedToggle>
    <OptionShare></OptionShare>
    <OptionRestart></OptionRestart>
    <OptionSave></OptionSave>
  </div>
);

export default CaravanSectionOptions;
