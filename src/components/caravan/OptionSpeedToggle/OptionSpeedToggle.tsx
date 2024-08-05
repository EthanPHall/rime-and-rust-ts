import React, { FC, useContext } from 'react';
import './OptionSpeedToggle.css';
import HoverButton from '../../misc/HoverButton/HoverButton';
import Popup from 'reactjs-popup';
import { SettingsContext } from '../../../context/misc/SettingsContext';

interface OptionSpeedToggleProps {}

const OptionSpeedToggle: FC<OptionSpeedToggleProps> = () => {
  const settingsContext = useContext(SettingsContext);

  return(
  <Popup
    trigger={<button className="option-speed-toggle" data-testid="option-speed-toggle">Speed</button>}
    on={['hover', 'focus']}
    position={'top center'}
  >
    <div className="tooltip">
      {settingsContext.settingsManager.getSpeedSettings().map((currentSpeedSetting) => {
        return (
          <button
            className={`${currentSpeedSetting.name == settingsContext.settingsManager.getCurrentSpeedSetting().name && "selected-speed-toggle"}`}
            key={"speed-setting-"+currentSpeedSetting.name}
            onClick={() => {settingsContext.setSettingsManager((prev) => {
              const newSettingsManager = prev.clone();
              newSettingsManager.setSpeedSetting(currentSpeedSetting.name);

              return newSettingsManager;
            })}}
          >{currentSpeedSetting.name}</button>
        )
      })}
    </div>
  </Popup>
);}

export default OptionSpeedToggle;
