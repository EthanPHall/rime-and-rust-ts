import React from 'react';
import logo from './logo.svg';
import './App.css';
import './variables.css';
import CaravanParent from './components/caravan/CaravanParent/CaravanParent';
import MapParent from './components/map/MapParent/MapParent';
import CombatParent from './components/combat/CombatParent/CombatParent';
import EventParent from './components/events/EventParent/EventParent';

function App() {

  
  
  return (
    <div className="App">
      {/* <EventParent></EventParent> */}
      <CombatParent></CombatParent>
      <CaravanParent></CaravanParent>
      {/* <MapParent></MapParent> */}
    </div>
  );
}

export default App;
