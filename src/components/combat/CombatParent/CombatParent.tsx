import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './CombatParent.css';
import CombatMap from '../CombatMap/CombatMap';
import ActionsDisplay from '../ActionsDisplay/ActionsDisplay';
import LootDisplay from '../LootDisplay/LootDisplay';
import HpDisplay from '../HPDisplay/HPDisplay';
import TurnDisplay from '../TurnDisplay/TurnDisplay';
import ComboSection from '../ComboSection/ComboSection';
import ComponentSwitcher from '../ComponentSwitcher/ComponentSwitcher';
import CombatMapManager from '../../../classes/combat/CombatMapManager';
import CombatManager from '../../../classes/combat/CombatManager';
import CombatAction, { Attack, Block, CombatActionWithRepeat, CombatActionWithUses, Move } from '../../../classes/combat/CombatAction';
import CombatMapData from '../../../classes/combat/CombatMapData';
import AreaOfEffect from '../../../classes/combat/AreaOfEffect';
import Directions from '../../../classes/utility/Directions';
import Vector2 from '../../../classes/utility/Vector2';
import MapUtilities from '../../../classes/utility/MapUtilities';
import CombatLocationData from '../../../classes/combat/CombatLocationData';
import CombatInfoDisplay, { CombatInfoDisplayProps } from '../CombatInfoDisplay/CombatInfoDisplay';
import CombatEnemy, { RustedBrute, RustedShambler } from '../../../classes/combat/CombatEnemy';
import CombatHazard, { VolatileCanister, Wall } from '../../../classes/combat/CombatHazard';
import CombatPlayer from '../../../classes/combat/CombatPlayer';
import TurnManager from '../../../classes/combat/TurnManager';
import useTurnManager from '../../../hooks/useTurnManager';
import IdGenerator from '../../../classes/utility/IdGenerator';
import CombatEntity from '../../../classes/combat/CombatEntity';
import CSSCombatAnimator from '../../../classes/animation/CSSCombatAnimator';
import useRefState from '../../../hooks/useRefState';
import IActionExecutor from '../../../classes/combat/IActionExecutor';
import useActionExecutor from '../../../hooks/useActionExecutor';
import useBasicActionExecutor from '../../../hooks/useBasicActionExecutor';
import CombatMapFramerMotion from '../CombatMapFramerMotion/CombatMapFramerMotion';
import { useAnimate } from 'framer-motion';
import MotionCombatAnimator from '../../../classes/animation/MotionCombatAnimator';
import { MotionAnimation } from '../../../classes/animation/CombatAnimationDetailsToMotionAnimation';
import CombatEnemyFactory from '../../../classes/combat/CombatEnemyFactory';

interface CombatParentProps {}

class EnemyStarterInfo{
  type: string;
  position: Vector2;

  constructor(type: string, position: Vector2){
    this.type = type;
    this.position = position;
  }
}

abstract class CombatMapTemplate{
  size: Vector2;
  enemies: EnemyStarterInfo[];
  hazards: CombatHazard[];
  advanceTurn: () => void;

  constructor(size:Vector2, enemies: EnemyStarterInfo[], hazards: CombatHazard[], advanceTurn: () => void){
    this.size = size;
    this.enemies = enemies;
    this.hazards = hazards;
    this.advanceTurn = advanceTurn;
  }
}

class CombatMapTemplate1 extends CombatMapTemplate{
  
  constructor(
    advanceTurn: () => void
  ){
    const size:Vector2 = new Vector2(15, 15);
    const walls: Wall[] = Wall.createDefaultWalls(
      [
        {start: new Vector2(8, 8), end: new Vector2(12, 8)},
        {start: new Vector2(8, 9), end: new Vector2(8, 12)},
        {start: new Vector2(8, 12), end: new Vector2(12, 12)},
        {start: new Vector2(12, 8), end: new Vector2(12, 13)},
      ]
    );
    const enemies: EnemyStarterInfo[] = [
      new EnemyStarterInfo('RustedShambler', new Vector2(9, 11)),
      new EnemyStarterInfo('RustedShambler', new Vector2(10, 11)),
      new EnemyStarterInfo('RustedBrute', new Vector2(11, 11)),
      new EnemyStarterInfo('RustedShambler', new Vector2(8, 7)),
      new EnemyStarterInfo('RustedShambler', new Vector2(6, 7)),
      new EnemyStarterInfo('RustedShambler', new Vector2(7, 6)),
    ];
    const hazards: CombatHazard[] = [new VolatileCanister(IdGenerator.generateUniqueId(), 10, 10, '+', 'Volatile Canister', new Vector2(3, 3), false)];

    super(size, enemies, [...walls, ...hazards], advanceTurn);
  }
}



const CombatParent: FC<CombatParentProps> = () => {
  
  const [turnManager, isTurnTakerPlayer] = useTurnManager();
  const [comboListForEffects, getComboList, setComboList] = useRefState<CombatActionWithRepeat[]>([]);

  const [mapTemplate, setMapTemplate] = useState<CombatMapTemplate>(new CombatMapTemplate1(turnManager.advanceTurn));
  
  //I was running into issues with closures I think. I was passing refreshMap() to the animator, but when it was called there,
  //the player wasn't up to date. That led to weird behavior where the player would move and be animated correctly the first time,
  //but then with the next action, the player would reset to its old position. So I made a hook where setPlayer also updates
  //a ref that everyone can use to make sure that they're using the most up-to-date player, and a function to get that ref's value,
  //so no more trying to get the player by value, it's all by reference now.
  const [playerForEffects, getPlayer, setPlayer] = useRefState<CombatPlayer>(new CombatPlayer(IdGenerator.generateUniqueId(), 100, 100, '@', 'Player', new Vector2(7, 7), turnManager.advanceTurn, resetActionUses));
  const [enemiesForEffects, getEnemies, setEnemies] = useRefState<CombatEnemy[]>([]);
  const [hazardsForEffects, getHazards, setHazards] = useRefState<CombatHazard[]>(mapTemplate.hazards );

  
  const [baseMap, setBaseMap] = useState<CombatMapData>(createMapFromTemplate(mapTemplate));
  const [mapToSendOff, setMapToSendOff] = useState<CombatMapData>(getBaseMapClonePlusAddons());
  const mapToSendOffCached = useRef<CombatMapData>(mapToSendOff);
  const [aoeToDisplay, setAoeToDisplay] = useState<AreaOfEffect|null>(
    new AreaOfEffect(3, Directions.RIGHT, 1, true)
  );
 
  const [playerActions, setPlayerActions] = useState<CombatActionWithUses[]>([
    new CombatActionWithUses(new Attack(getPlayer().id, undefined, 5, getCachedMap, updateEntity, refreshMap), 3),
    new CombatActionWithUses(new Block(getPlayer().id, updateEntity, refreshMap), 1),
    new CombatActionWithUses(new Move(getPlayer().id, undefined, getCachedMap, updateEntity, refreshMap), 15),
  ]);
  
  const [infoCardData, setInfoCardData] = useState<CombatInfoDisplayProps | null>(null);
  function hideCard(){
    setInfoCardData(null);
  }
  function showCard(title: string, description: string){
    setInfoCardData({title, description, hideCard});
  }
  
  // const [motionAnimationsList, setMotionAnimationsList] = useState<MotionAnimation[]>([]);
  const [mapScope, mapAnimate] = useAnimate();
  const [animator, setAnimator] = useState<MotionCombatAnimator>(new MotionCombatAnimator(getCachedMap, mapAnimate));
  
  // const actionExecutor:IActionExecutor = useActionExecutor(mapToSendOff, comboList, setComboList, animator, refreshMap);
  const actionExecutor:IActionExecutor = useActionExecutor(mapToSendOff, comboListForEffects, setComboList, animator, turnManager);
  const actionExecutorRef = useRef<IActionExecutor>(actionExecutor);
  
  useEffect(() => {
    const enemyFactory = new CombatEnemyFactory(
      turnManager.advanceTurn,
      addToComboList,
      executeActionsList,
      getCachedMap,
      updateEntity,
      refreshMap
    );
    setEnemies(mapTemplate.enemies.map(enemyInfo => enemyFactory.createEnemy(enemyInfo.type, enemyInfo.position)));
    
    turnManager.finishSetup([getPlayer(), ...getEnemies()]);
  },[])

  useEffect(() => {
    refreshMap();
  }, [playerForEffects, enemiesForEffects, hazardsForEffects]);

  useEffect(() => {
    actionExecutorRef.current = actionExecutor;
  }, [actionExecutor]);

  function refreshMap():void{
    const newMap: CombatMapData = getBaseMapClonePlusAddons();
    mapToSendOffCached.current = newMap;
    setMapToSendOff(newMap);
  }
  function createMapFromTemplate(template: CombatMapTemplate): CombatMapData{
    const newMap: CombatMapData = new CombatMapData(template.size.x, template.size.y);

    return newMap; 
  }
  function getBaseMapClonePlusAddons(): CombatMapData{
    const newMap: CombatMapData = CombatMapData.clone(baseMap);

    getEnemies().forEach(enemy => {
      if (enemy.hp <= 0) {
        return;
      }
      newMap.setLocationWithEntity(enemy);
    });
    getHazards().forEach(hazard => {
      if (hazard.hp <= 0) {
        return;
      }
      newMap.setLocationWithEntity(hazard);
    });

    newMap.setLocationWithEntity(getPlayer());

    return newMap;
  }
  function getCachedMap(): CombatMapData{
    return mapToSendOffCached.current;
  }

  function resetActionUses() : void{
    const newPlayerActions: CombatActionWithUses[] = [...playerActions];

    newPlayerActions.forEach(action => {
      action.uses = action.maxUses;
    });
    setPlayerActions(newPlayerActions);
  }
  function reduceActionUses(index: number) : void{
    const newPlayerActions: CombatActionWithUses[] = [...playerActions];
    newPlayerActions[index].uses--;
    setPlayerActions(newPlayerActions);
  }

  function addToComboList(newAction: CombatAction) {
    const newWithRepeat: CombatActionWithRepeat = new CombatActionWithRepeat(newAction);
    const comboList = getComboList();

    const lastAction: CombatActionWithRepeat = comboList[comboList.length - 1];
    if (lastAction && lastAction.areEquivalent(newWithRepeat)) {
      lastAction.incrementRepeat();
      setComboList([...comboList]);
      return;
    }

    setComboList([...comboList, newWithRepeat]);
  }

  function updateEntity(id: number, newEntity: CombatEntity) {
    if (newEntity instanceof CombatEnemy) {
      const newEnemies = getEnemies().map(enemy => enemy.id === id ? newEntity : enemy);
      setEnemies(newEnemies);
    } else if (newEntity instanceof CombatHazard) {
      const newHazards = getHazards().map(hazard => hazard.id === id ? newEntity : hazard);
      setHazards(newHazards);
    } else if (newEntity instanceof CombatPlayer) {
      setPlayer(newEntity);
    }
  }

  async function framerMotionAnimate(animationList: MotionAnimation[]){
    for(let i = 0; i < animationList.length; i++){
      // await mapAnimate();
    }

  }



function executeActionsList() {
  if(!actionExecutorRef.current.isExecuting()) {
    actionExecutorRef.current.execute();
  }
}


  function debug_movePlayer() {
    const newPlayer = new CombatPlayer(getPlayer().id, getPlayer().hp, getPlayer().maxHp, getPlayer().symbol, getPlayer().name, new Vector2(getPlayer().position.x + 1, getPlayer().position.y), getPlayer().advanceTurn, getPlayer().resetActionUses);
    setPlayer(newPlayer);
  }
  function debug_harmPlayer() {
    const newPlayer = new CombatPlayer(getPlayer().id, getPlayer().hp - 10, getPlayer().maxHp, getPlayer().symbol, getPlayer().name, getPlayer().position, getPlayer().advanceTurn, getPlayer().resetActionUses);
    setPlayer(newPlayer);
  }
  function debug_endTurn() {
    turnManager.currentTurnTaker?.endTurn();
  }

  return (
    <div className="combat-parent" data-testid="combat-parent">
        <button onClick={debug_movePlayer}>Debug Move Player</button>
        {/* <button onClick={debug_harmPlayer}>Debug Harm Player</button> */}
        <button onClick={debug_endTurn}>Debug End Turn</button>
        <div className='combat-parent-grid-parent'>
          <div className='combat-parent-map-actions-composite'>
            <CombatMapFramerMotion map={mapToSendOff} setMap={setBaseMap} aoeToDisplay={aoeToDisplay} scope={mapScope}></CombatMapFramerMotion>
            <ActionsDisplay addToComboList={addToComboList} actions={playerActions} setActions={setPlayerActions} reduceActionUses={reduceActionUses} isTurnTakerPlayer={isTurnTakerPlayer} actionsAreExecuting={actionExecutor.isExecuting}></ActionsDisplay>
          </div>
            {/* <LootDisplay></LootDisplay> */}
            <HpDisplay hp={getPlayer().hp} maxHp={getPlayer().maxHp}></HpDisplay>
            <TurnDisplay currentTurnTaker={turnManager.currentTurnTaker}></TurnDisplay>
            <ComboSection comboList={comboListForEffects} setComboList={setComboList} resetActionUses={resetActionUses} actionExecutor={actionExecutor} isTurnTakerPlayer={isTurnTakerPlayer}></ComboSection>
            <ComponentSwitcher enemies={enemiesForEffects} hazards={hazardsForEffects} showCard={showCard}></ComponentSwitcher>
            {infoCardData != null && <CombatInfoDisplay {...infoCardData}></CombatInfoDisplay>}
        </div>
    </div>
  );
}

export default CombatParent;
