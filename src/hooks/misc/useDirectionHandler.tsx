import { useCallback, useEffect, useRef, useState } from "react";
import Directions, { DirectionObject } from "../../classes/utility/Directions";

function useDirectionHandler(defaultActivation:boolean = false, pause:boolean = false){
    const [activateControls, setActivateControls] = useState<boolean>(defaultActivation);
    const [direction, setDirection] = useState<DirectionObject>({direction:Directions.NONE});
    const pauseRef = useRef(pause);

    useEffect(() => {
      pauseRef.current = pause;
    }, [pause])

    const handleDirectionInputs = useCallback((event:any) => {
      const DEBUG_ALLOW_PAUSED_MOVEMENT = true;

      if(pauseRef.current && DEBUG_ALLOW_PAUSED_MOVEMENT){
        return;
      }

      if (activateControls && (event.key === "ArrowUp" || event.key === "w")) {
        setDirection(new DirectionObject(Directions.UP));
      }
      else if (activateControls && (event.key === "ArrowDown" || event.key === "s")) {
        setDirection(new DirectionObject(Directions.DOWN));
      }
      else if (activateControls && (event.key === "ArrowLeft" || event.key === "a")) {
        setDirection(new DirectionObject(Directions.LEFT));
      }
      else if (activateControls && (event.key === "ArrowRight" || event.key === "d")) {
        setDirection(new DirectionObject(Directions.RIGHT));
      }
    }, [activateControls, setDirection]);
  
    useEffect(() => {
      document.addEventListener("keydown", handleDirectionInputs, false);
  
      return () => {
        document.removeEventListener("keydown", handleDirectionInputs, false);
      };
    }, [handleDirectionInputs]);

    return [direction]
}

export default useDirectionHandler;