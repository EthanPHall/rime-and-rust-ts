import React, { FC, useEffect, useMemo, useState } from 'react';
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
import CombatAction, { CombatActionWithRepeat, CombatActionWithUses } from '../../../classes/combat/CombatAction';
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
import useTurnManager from '../useTurnManager';

interface CombatParentProps {}

abstract class CombatMapTemplate{
  size: Vector2;
  enemies: CombatEnemy[];
  hazards: CombatHazard[];

  constructor(size:Vector2, enemies: CombatEnemy[], hazards: CombatHazard[]){
    this.size = size;
    this.enemies = enemies;
    this.hazards = hazards;
  }
}

class CombatMapTemplate1 extends CombatMapTemplate{
  constructor(){
    const size:Vector2 = new Vector2(15, 15);
    const walls: Wall[] = Wall.createDefaultWalls(
      [
        {start: new Vector2(8, 8), end: new Vector2(12, 8)},
        {start: new Vector2(8, 8), end: new Vector2(8, 12)},
        {start: new Vector2(8, 12), end: new Vector2(12, 12)},
        {start: new Vector2(12, 8), end: new Vector2(12, 13)},
      ]
    );
    const enemies: CombatEnemy[] = [
      new RustedShambler(10, 10, 'S', 'Rusted Shambler', new Vector2(10, 10), () => {console.log('Advance turn not set');}),
      new RustedBrute(20, 20, 'B', 'Rusted Brute', new Vector2(9, 9), () => {console.log('Advance turn not set');}),
      new RustedShambler(10, 10, 'S', 'Rusted Shambler', new Vector2(11, 11), () => {console.log('Advance turn not set');}),
    ];
    const hazards: CombatHazard[] = [new VolatileCanister(10, 10, '+', 'Volatile Canister', new Vector2(3, 3), false)];

    super(size, enemies, [...walls, ...hazards]);
  }
}

const CombatParent: FC<CombatParentProps> = () => {
  const [mapTemplate, setMapTemplate] = useState<CombatMapTemplate>(new CombatMapTemplate1());

  
  const [comboList, setComboList] = useState<CombatActionWithRepeat[]>([]);
  const [playerActions, setPlayerActions] = useState<CombatActionWithUses[]>([
    new CombatActionWithUses(new CombatAction('Attack', true), 3),
    new CombatActionWithUses(new CombatAction('Block', false), 1),
    new CombatActionWithUses(new CombatAction('Move', true), 5),
  ]);
  
  const [enemies, setEnemies] = useState<CombatEnemy[]>(mapTemplate.enemies);
  const [hazards, setHazards] = useState<CombatHazard[]>(mapTemplate.hazards);
  const [player, setPlayer] = useState<CombatPlayer>(new CombatPlayer(100, 100, '@', 'Player', new Vector2(7, 7)));
  const [baseMap, setBaseMap] = useState<CombatMapData>(createMapFromTemplate(mapTemplate));
  const [mapToSendOff, setMapToSendOff] = useState<CombatMapData>(getBaseMapClonePlusAddons());
  const [aoeToDisplay, setAoeToDisplay] = useState<AreaOfEffect|null>(
    new AreaOfEffect(3, Directions.RIGHT, 1, true)
  );
  
  const [infoCardData, setInfoCardData] = useState<CombatInfoDisplayProps | null>(null);
  function hideCard(){
    setInfoCardData(null);
  }
  function showCard(title: string, description: string){
    setInfoCardData({title, description, hideCard});
  }

  const turnManager:TurnManager = useTurnManager([player, ...mapTemplate.enemies]);
  
  useEffect(() => {
    setMapToSendOff(getBaseMapClonePlusAddons());
  }, [player, enemies, hazards]);

  function createMapFromTemplate(template: CombatMapTemplate): CombatMapData{
    const newMap: CombatMapData = new CombatMapData(template.size.x, template.size.y);

    return newMap; 
  }
  function getBaseMapClonePlusAddons(): CombatMapData{
    const newMap: CombatMapData = CombatMapData.clone(baseMap);

    enemies.forEach(enemy => {
      if (enemy.hp <= 0) {
        return;
      }
      newMap.locations[enemy.position.y][enemy.position.x] = new CombatLocationData(enemy.position.x, enemy.position.y, enemy.name, enemy.symbol, false, false);
    });
    hazards.forEach(hazard => {
      if (hazard.hp <= 0) {
        return;
      }
      newMap.locations[hazard.position.y][hazard.position.x] = new CombatLocationData(hazard.position.x, hazard.position.y, hazard.name, hazard.symbol, false, hazard.solid);
    });

    newMap.locations[player.position.y][player.position.x] = new CombatLocationData(player.position.x, player.position.y, player.name, player.symbol, false, false);

    return newMap;
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

    const lastAction: CombatActionWithRepeat = comboList[comboList.length - 1];
    if (lastAction && lastAction.areEquivalent(newWithRepeat)) {
      lastAction.incrementRepeat();
      setComboList([...comboList]);
      return;
    }

    setComboList([...comboList, newWithRepeat]);
  }

  function debug_movePlayer() {
    const newPlayer = new CombatPlayer(player.hp, player.maxHp, player.symbol, player.name, new Vector2(player.position.x + 1, player.position.y));
    setPlayer(newPlayer);
  }
  function debug_harmPlayer() {
    const newPlayer = new CombatPlayer(player.hp - 10, player.maxHp, player.symbol, player.name, player.position);
    setPlayer(newPlayer);
  }
  function debug_endTurn() {
    turnManager.currentTurnTaker.endTurn();
  }

  return (
    <div className="combat-parent" data-testid="combat-parent">
        {/* <button onClick={debug_movePlayer}>Debug Move Player</button> */}
        {/* <button onClick={debug_harmPlayer}>Debug Harm Player</button> */}
        <button onClick={debug_endTurn}>Debug End Turn</button>
        <div className='combat-parent-grid-parent'>
          <div className='combat-parent-map-actions-composite'>
            <CombatMap map={mapToSendOff} setMap={setBaseMap} aoeToDisplay={aoeToDisplay}></CombatMap>
            <ActionsDisplay addToComboList={addToComboList} actions={playerActions} setActions={setPlayerActions} reduceActionUses={reduceActionUses}></ActionsDisplay>
          </div>
            {/* <LootDisplay></LootDisplay> */}
            <HpDisplay hp={player.hp} maxHp={player.maxHp}></HpDisplay>
            <TurnDisplay currentTurnTaker={turnManager.currentTurnTaker}></TurnDisplay>
            <ComboSection comboList={comboList} setComboList={setComboList} resetActionUses={resetActionUses}></ComboSection>
            <ComponentSwitcher enemies={enemies} hazards={hazards} showCard={showCard}></ComponentSwitcher>
            {infoCardData != null && <CombatInfoDisplay {...infoCardData}></CombatInfoDisplay>}
        </div>
    </div>
  );
}

export default CombatParent;
