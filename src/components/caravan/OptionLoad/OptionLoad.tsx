import React, { FC, useContext, useEffect, useState } from 'react';
import './OptionLoad.css';
import { SaveObject, SettingsContext } from '../../../context/misc/SettingsContext';
import Popup from 'reactjs-popup';
import { stringify } from 'querystring';

interface OptionLoadProps {
  setLoadObject:React.Dispatch<React.SetStateAction<SaveObject | null>>
}

const OptionLoad: FC<OptionLoadProps> = ({setLoadObject}) => {
  const settingsContext = useContext(SettingsContext);
  const [displayBackground, setDisplayBackground] = useState(false);
  const [localLoadObject, setLocalLoadObject] = useState<SaveObject | null>(null);
  const [localLoadString, setLocalLoadString] = useState<string>("");

  useEffect(() => {
    try{
      const loadObject:SaveObject = JSON.parse(localLoadString);
      setLocalLoadObject(loadObject);
    }
    catch{
      console.log("Could not parse load string");
    }
  }, [localLoadString]);

  return (
  <div className="option-load" data-testid="option-load">
    <div className={`${displayBackground ? "load-popup-background" : ""}`}>
    </div>
    <Popup
      trigger={<button>Load</button>}
      modal
      closeOnEscape
      onOpen={() => {setDisplayBackground(true)}}
      onClose={() => {setDisplayBackground(false)}}
    >
        <div className='load-popup-content'>
          <div className='load-popup-title'>Load</div>
          <div className='load-popup-text'>Paste a Rime and Rust save file below.</div>
          <textarea spellCheck={false} className='load-popup-input' onChange={(event) => {
            setLocalLoadString(event.target.value)
          }}>

          </textarea>
          <div className='load-popup-buttons'>
            <button onClick={() => {
              setLoadObject(localLoadObject)
            }}>Confirm</button>
          </div>
        </div>
    </Popup>
  </div>
)};

export default OptionLoad;
