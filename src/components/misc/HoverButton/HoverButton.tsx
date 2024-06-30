import { FC } from "react";

interface HoverButtonProps {
    buttonText:string;
    popupText:string;
    onClick:()=>void;
}
  
const HoverButton: FC<HoverButtonProps> = ({buttonText, popupText, onClick}) => {

    

    return (
        <button onClick={onClick}>{buttonText}</button>
    );
}
  