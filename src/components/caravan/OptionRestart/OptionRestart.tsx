import React, { FC } from 'react';
import './OptionRestart.css';

interface OptionRestartProps {
  autoSaveInterval:NodeJS.Timer;
}

const OptionRestart: FC<OptionRestartProps> = ({autoSaveInterval}) => (
  <div className="option-restart" data-testid="option-restart">
    <button onClick={() => {
      if(window.confirm("Restart game? All progress will be lost.") == true){
        clearInterval(autoSaveInterval);
        localStorage.removeItem("saveFile");
        window.location.reload();
      }
    }}>Restart</button>
  </div>
);

export default OptionRestart;
