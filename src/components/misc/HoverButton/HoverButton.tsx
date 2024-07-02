import { FC } from "react";
import Popup from "reactjs-popup";
import './HoverButton.css';

interface HoverButtonProps {
    buttonText:string;
    popupText:string;
    onClick:()=>void;
}
  
const HoverButton: FC<HoverButtonProps> = ({buttonText, popupText, onClick}) => {
    return (
        <Popup 
            trigger={<button onClick={onClick}>{buttonText}</button>}
            on={['hover', 'focus']}
            disabled={popupText === ""}
        >
            <div className="tooltip">{popupText}</div>
        </Popup>
    );
}

export default HoverButton;