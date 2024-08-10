import React, { FC, useContext, useEffect, useState } from 'react';
import './OptionSave.css';
import { SaveObject, SettingsContext } from '../../../context/misc/SettingsContext';
import Popup from 'reactjs-popup';
import { stringify } from 'querystring';

interface OptionSaveProps {
  getSaveObject():SaveObject
}

const OptionSave: FC<OptionSaveProps> = ({getSaveObject}) => {
  const settingsContext = useContext(SettingsContext);
  const [displayBackground, setDisplayBackground] = useState(false);
  const [copyConfirmationOpen, setCopyConfirmationOpen] = useState(false);
  const [stringifiedObject, setStringifiedObject] = useState("");

  useEffect(() => {
    // console.log(displayBackground);
  }, [displayBackground]);

  return (
  <div className="option-save" data-testid="option-save">
    <div className={`${displayBackground ? "save-popup-background" : ""}`}>
    </div>
    <Popup
      trigger={<button>Save</button>}
      modal
      closeOnEscape
      nested
      onOpen={() => {setDisplayBackground(true); setStringifiedObject(JSON.stringify(getSaveObject()))}}
      onClose={() => {setDisplayBackground(false)}}
    >
        <div className='save-popup-content'>
          <div className='save-popup-title'>Save</div>
          <div className='save-popup-text'>Copy the text below and store it in a .txt file. I can't guarantee that it will work if you store it in a word doc or any other format. Modify it at your own risk!</div>
          <div className='save-popup-json-display'>
            {stringifiedObject}
          </div>
          <div className='save-popup-buttons'>
            <Popup
              trigger={
                <button>Copy to clipboard</button>
              }
              onOpen={() => {navigator.clipboard.writeText(stringifiedObject); setCopyConfirmationOpen(true); setTimeout(() => {setCopyConfirmationOpen(false);}, 2000)}}
              position={'top center'}
              open={copyConfirmationOpen}
            >
              <div className='save-popup-copied'>Copied</div>
            </Popup>
          </div>
        </div>
    </Popup>
  </div>
)};

export default OptionSave;
