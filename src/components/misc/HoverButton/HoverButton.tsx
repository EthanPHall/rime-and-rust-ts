import { FC } from "react";
import Popup from "reactjs-popup";
import './HoverButton.css';

interface HoverButtonProps {
    buttonText:string;
    popupText:string;
    onClick:()=>void;
    greyedOut?:boolean;
}
  
const HoverButton: FC<HoverButtonProps> = ({buttonText, popupText, onClick, greyedOut}) => {
    function executeIfNotGrey(){
        if(!greyedOut){
            onClick();
        }
    }

    return (
        <Popup 
            trigger={<button className={`${greyedOut && "grey-out"}`} onClick={executeIfNotGrey}>{buttonText}</button>}
            on={['hover', 'focus']}
            disabled={popupText === ""}
            position="top center"
        >
            <div className={`tooltip ${greyedOut && "grey-out"}`}>{popupText}</div>
        </Popup>
    );
}

export default HoverButton;