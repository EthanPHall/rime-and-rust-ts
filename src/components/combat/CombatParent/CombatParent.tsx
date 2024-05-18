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

interface CombatParentProps {}

abstract class CombatEntity{
  hp: number;
  maxHp: number;
  symbol: string;
  name: string;
  position: Vector2;

  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
    this.hp = hp;
    this.maxHp = maxHp;
    this.symbol = symbol;
    this.name = name;
    this.position = position;
  }
}

class CombatPlayer extends CombatEntity{
  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
    super(hp, maxHp, symbol, name, position);
  }
}

abstract class CombatEnemy extends CombatEntity{
  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
    super(hp, maxHp, symbol, name, position);
  }
}

class RustedShambler extends CombatEnemy{
  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
    super(hp, maxHp, symbol, name, position);
  }
}

class RustedBrute extends CombatEnemy{
  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2){
    super(hp, maxHp, symbol, name, position);
  }
}

abstract class CombatHazard extends CombatEntity{
  solid: boolean;

  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
    super(hp, maxHp, symbol, name, position);
    this.solid = solid;
  }
}

class Wall extends CombatHazard{
  static WALL_HP = 10;

  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
    super(hp, maxHp, symbol, name, position, solid);
  }

  static createDefaultWall(position: Vector2): Wall{
    return new Wall(Wall.WALL_HP, Wall.WALL_HP, '#', 'Wall', position, true);
  }

  static createDefaultWalls(startEndPointPair: {start:Vector2, end:Vector2}[]): Wall[]{
    const walls: Wall[] = [];

    startEndPointPair.forEach(pair => {
      const line:Vector2[] = MapUtilities.getLineBetweenPoints(pair.start, pair.end);

      line.forEach(point => {
        walls.push(Wall.createDefaultWall(point));
      });
    });

    return walls;
  }
}

class VolatileCanister extends CombatHazard{
  constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
    super(hp, maxHp, symbol, name, position, solid);
  }
}

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
      new RustedShambler(10, 10, 'S', 'Rusted Shambler', new Vector2(5, 5)),
      new RustedBrute(20, 20, 'B', 'Rusted Brute', new Vector2(10, 10)),
      new RustedShambler(10, 10, 'S', 'Rusted Shambler', new Vector2(0, 0)),
    ];
    const hazards: CombatHazard[] = [new VolatileCanister(10, 10, '+', 'Volatile Canister', new Vector2(3, 3), false)];

    super(size, enemies, [...walls, ...hazards]);
  }
}

const CombatParent: FC<CombatParentProps> = () => {
  const MAP_TEMPLATE = new CombatMapTemplate1();

  const [comboList, setComboList] = useState<CombatActionWithRepeat[]>([]);
  const [playerActions, setPlayerActions] = useState<CombatActionWithUses[]>([
    new CombatActionWithUses(new CombatAction('Attack', true), 3),
    new CombatActionWithUses(new CombatAction('Block', false), 1),
    new CombatActionWithUses(new CombatAction('Move', true), 5),
  ]);

  const [enemies, setEnemies] = useState<CombatEnemy[]>(MAP_TEMPLATE.enemies);
  const [hazards, setHazards] = useState<CombatHazard[]>(MAP_TEMPLATE.hazards);
  const [player, setPlayer] = useState<CombatPlayer>(new CombatPlayer(100, 100, '@', 'Player', new Vector2(7, 7)));
  const [baseMap, setBaseMap] = useState<CombatMapData>(createMapFromTemplate(MAP_TEMPLATE));
  const [mapToSendOff, setMapToSendOff] = useState<CombatMapData>(getBaseMapClonePlusAddons());
  const [aoeToDisplay, setAoeToDisplay] = useState<AreaOfEffect|null>(
    new AreaOfEffect(3, Directions.RIGHT, 1, true)
  );

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

  return (
    <div className="combat-parent" data-testid="combat-parent">
        <button onClick={debug_movePlayer}>Debug Move Player</button>
        <div className='combat-parent-grid-parent'>
          <div className='combat-parent-map-actions-composite'>
            <CombatMap map={mapToSendOff} setMap={setBaseMap} aoeToDisplay={aoeToDisplay}></CombatMap>
            <ActionsDisplay addToComboList={addToComboList} actions={playerActions} setActions={setPlayerActions} reduceActionUses={reduceActionUses}></ActionsDisplay>
          </div>
            {/* <LootDisplay></LootDisplay> */}
            <HpDisplay></HpDisplay>
            <TurnDisplay></TurnDisplay>
            <ComboSection comboList={comboList} setComboList={setComboList} resetActionUses={resetActionUses}></ComboSection>
            <ComponentSwitcher></ComponentSwitcher>
        </div>
    </div>
  );
}

export default CombatParent;
