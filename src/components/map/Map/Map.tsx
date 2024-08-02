import React, { cloneElement, FC, useCallback, useEffect, useRef, useState } from 'react';
import './Map.css';
import MapLocation from '../MapLocation/MapLocation';
import IMap from '../../../classes/exploration/IMap';
import ChunkMap from '../../../classes/exploration/ChunkMap';
import IMapLocationFactory from '../../../classes/exploration/IMapLocationFactory';
import MapLocationFactoryJSONSimplexNoise from '../../../classes/exploration/MapLocationFactoryJSONSimplexNoise';
import Vector2 from '../../../classes/utility/Vector2';
import MapLocationVisualJSON from '../../../classes/exploration/MapLocationVisualJSON';
import IMapLocationVisual from '../../../classes/exploration/IMapLocationVisual';
import useDirectionHandler from '../../../hooks/misc/useDirectionHandler';
import Directions, { DirectionsUtility } from '../../../classes/utility/Directions';
import { TargetAndTransition } from 'framer-motion';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';
import IMapLocation from '../../../classes/exploration/IMapLocation';
import getRadiusOfPoints from '../../../classes/utility/getRadiusOfPoints';

interface MapProps {
  currentCombat:string|null
  currentEvent:string|null
  setCurrentEvent: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentEventLocation: React.Dispatch<React.SetStateAction<IMapLocation | null>>
  locationToClear:IMapLocation|null
  setLocationToClear:React.Dispatch<React.SetStateAction<IMapLocation | null>>
  savedMap:IMap|null
  setSavedMap:React.Dispatch<React.SetStateAction<IMap | null>>
}

class ExplorationPlayer{
  position:Vector2;
  locationVisual:IMapLocationVisual = {
    getStyles:function():string{
      return "player lower";
    },

    getSymbol:function():string{
      return "@";
    },

    getAnimation:function():TargetAndTransition|undefined{
      return undefined;
    },

    getRevealed:function():boolean{
      return true;
    }
  }

  constructor(position:Vector2){
    this.position = position;
  }

  clone():ExplorationPlayer{
    return new ExplorationPlayer(this.position)
  }
}

class CurrentAndBaseElement{
  private base:JSX.Element;
  private current:JSX.Element;

  constructor(base:JSX.Element, current?:JSX.Element){
    this.current = current || base;
    this.base = base;
  }

  replace(newElement:JSX.Element){
    this.current = newElement;
  }

  returnToBase(){
    this.current = this.base;
  }

  getCurrent():JSX.Element{
    return this.current;
  }

  forceUpdate(){
    this.current = cloneElement(this.current, this.current.props);
  }
}

const Map: FC<MapProps> = (
  {
    currentCombat,
    currentEvent,
    setCurrentEvent,
    setCurrentEventLocation,
    locationToClear,
    setLocationToClear,
    savedMap,
    setSavedMap
  }
) => {
  const [mapLocationFactory] = useState<IMapLocationFactory>(
    new MapLocationFactoryJSONSimplexNoise(0)
  );

  const [map, setMap] = useState<IMap>(
    savedMap ||
    new ChunkMap(
      mapLocationFactory,
      new Vector2(15, 15),
      new Vector2(3, 3)
    )
  );
  const mapRepresentation = useRef<CurrentAndBaseElement[][]>([]);
  const [visibleLocations, setVisibleLocations] = useState<boolean[][]>(
    new Array(map.getDimensions().y).fill(true).map(() => {
      return new Array(map.getDimensions().x).fill(false);
    })
  );
  
  const [player, setPlayer] = useState(new ExplorationPlayer(map.getCenterPoint()))
  
  const [pauseDirectionHandling, setPauseDirectionHandling] = useState<boolean>(false);
  const [direction] = useDirectionHandler(true, pauseDirectionHandling);

  const lastPlayerPosition = useRef<Vector2>(player.position);

  //Inelegant way to force an update probably, but oh well, it works and there's more important stuff to do.
  const [preventMovementDelay, setPreventMovementDelay] = useState(true);

  const hasMoved = useRef(false);
  
  useEffect(() => {
    if(savedMap){
      setPlayer(new ExplorationPlayer(savedMap.getCenterPoint()))
      setMap(savedMap);
    }
    else{
      setSavedMap(map);
    }

    return () => {
      setSavedMap((prev) => {
        const newMap = prev?.clone();

        visibleLocations.forEach((row, y) => {
          row.forEach((visibleFlag, x) => {
            if(visibleFlag){
              newMap?.setRevealed(new Vector2(x,y));
            }
          })
        })

        return prev || null;
      })
    }
  }, [])

  useEffect(() => {
    if(currentEvent || currentCombat){
      setPauseDirectionHandling(true);
    }
    else{
      setPauseDirectionHandling(false);
    }
  }, [currentEvent])

  useEffect(() => {
    setVisibleLocations((prev) => {      
      prev.forEach((row, y) => {
        row.forEach((visibleFlag, x) => {
          prev[x][y] = map.getLocationData(new Vector2(y,x)).getRevealed();
        })
      })

      return [...prev];
    })

    mapRepresentation.current = map.get2DRepresentation().map((row, y) => {
      return row.map((location, x) => {
        return new CurrentAndBaseElement(
          <MapLocation position={new Vector2(x, y)} key={`${x}${y}`} locationVisual={location} visibleLocations={visibleLocations}></MapLocation>,
          player.position.equals(new Vector2(x,y)) ? <MapLocation position={new Vector2(x, y)} visibleLocations={visibleLocations} key={`${x}${y}`} locationVisual={player.locationVisual}></MapLocation> : undefined
        );
      })
    });
  }, [map])

  useEffect(() => {
    getRadiusOfPoints(player.position, 2).forEach((point) => {
      if(point.y < 0 || point.y >= visibleLocations.length){
        return;
      }
      if(point.x < 0 || point.x >= visibleLocations[0].length){
        return;
      }
      
      visibleLocations[point.y][point.x] = true;

      //Wonky things happen with the player visual if the player position is forceUpdated,
      //so let's make sure that the player position is never force updated.
      mapRepresentation.current[point.y][point.x].returnToBase();
      mapRepresentation.current[point.y][point.x].forceUpdate();
    });
    setVisibleLocations([...visibleLocations]);
    
    // mapRepresentation.current[lastPlayerPosition.current.y][lastPlayerPosition.current.x].returnToBase();
    mapRepresentation.current[player.position.y][player.position.x].replace(
      <MapLocation position={player.position} visibleLocations={visibleLocations} key={`Player`} locationVisual={player.locationVisual}></MapLocation>
    );

    lastPlayerPosition.current = player.position;


    
    //DOne to prevent the home location from bringing the player back to teh caravan screen immediately.
    if(!hasMoved.current){
      return;
    }
    
    //?TODO: I should probaly just make mapRepresentation a state variable, but whatever, I can do that later.
    setPreventMovementDelay((current) => {return !current});
    setCurrentEvent(map.getEventToStart(player.position));
    setCurrentEventLocation(map.getLocation(player.position));
  }, [player])

  useEffect(() => {
    setPlayer((current) => {
      const newPlayer = current.clone();

      if(!DirectionsUtility.getVectorFromDirection(direction.direction).equals(new Vector2(0,0))){
        hasMoved.current = true;
      }
      newPlayer.position = newPlayer.position.add(DirectionsUtility.getVectorFromDirection(direction.direction));
      
      if(newPlayer.position.x < 0){
        newPlayer.position = new Vector2(0, newPlayer.position.y);
      }
      else if(newPlayer.position.x >= map.getDimensions().x){
        newPlayer.position = new Vector2(map.getDimensions().x - 1, newPlayer.position.y);
      }

      if(newPlayer.position.y < 0){
        newPlayer.position = new Vector2(newPlayer.position.x, 0);
      }
      else if(newPlayer.position.y >= map.getDimensions().y){
        newPlayer.position = new Vector2(newPlayer.position.x, map.getDimensions().y - 1);
      }

      return newPlayer;
    })
  }, [direction])

  useEffect(() => {
    if(locationToClear == null){
      return;
    }

    setMap((previous) => {
      const newMap = previous.clone();

      newMap.setCleared(locationToClear.getPostition());

      return newMap;
    });

    setLocationToClear(null);
  }, [locationToClear]);

  function regenerateMap(){
    // setMap(
    //   new ChunkMap(
    //     new MapLocationFactoryJSONSimplexNoise(Math.random()),
    //     new Vector2(7, 7),
    //     new Vector2(5, 5)
    //   )
    // );
  }

  return (
    <div className="map" data-testid="map" onClick={regenerateMap}>
      {
        mapRepresentation.current.map((currentRow, y) => {
          return <div key={y} className='row'>
            {
              currentRow.map((currentRep) => {
                return currentRep.getCurrent();
              })
            }         
          </div>
        })     
      }
    </div>
  );
}

export default Map;