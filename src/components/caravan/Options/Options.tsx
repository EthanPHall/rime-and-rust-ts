import React, { FC } from 'react';
import './Options.css';
import OptionCredits from '../OptionCredits/OptionCredits';
import OptionSpeedToggle from '../OptionSpeedToggle/OptionSpeedToggle';
import OptionShare from '../OptionShare/OptionShare';
import OptionRestart from '../OptionRestart/OptionRestart';
import OptionSave from '../OptionSave/OptionSave';

interface OptionsProps {}

const Options: FC<OptionsProps> = () => (
  <></>
  // <div className="options" data-testid="options">
  //   <OptionCredits></OptionCredits>
  //   <OptionSpeedToggle></OptionSpeedToggle>
  //   <OptionShare></OptionShare>
  //   <OptionRestart></OptionRestart>
  //   <OptionSave ></OptionSave>
  // </div>
);

export default Options;
