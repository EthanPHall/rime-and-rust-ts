import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './variables.css';
import CaravanParent from './components/caravan/CaravanParent/CaravanParent';
import MapParent from './components/map/MapParent/MapParent';
import CombatParent from './components/combat/CombatParent/CombatParent';
import EventParent from './components/events/EventParent/EventParent';

enum ProgressionFlagNames{
  COLLECTED_SCRAP = "COLLECTED_SCRAP",
  COLLECTED_PSYCHIUM_SCRAP = "COLLECTED_PSYCHIUM_SCRAP",
  COLLECTED_PURE_PSYCHIUM = "COLLECTED_PURE_PSYCHIUM",
}

type ProgressionContextType = {flags: Map<ProgressionFlagNames, boolean>, setFlags: (newFlags:Map<ProgressionFlagNames, boolean>) => void};
const ProgressionContext = createContext<ProgressionContextType>({flags: new Map(), setFlags: () => {}});

function App() {
  const [progressionFlags, setProgressionFlags] = React.useState<Map<ProgressionFlagNames, boolean>>(new Map());

  return (
    <ProgressionContext.Provider value={{flags:progressionFlags, setFlags:setProgressionFlags}}>
      <div className="App">
        {/* <EventParent></EventParent> */}
        {/* <CombatParent></CombatParent> */}
        <CaravanParent></CaravanParent>
        {/* <MapParent></MapParent> */}
      </div>
    </ProgressionContext.Provider>
  );
}

export default App;
export {ProgressionContext, ProgressionFlagNames}
export type {ProgressionContextType}
