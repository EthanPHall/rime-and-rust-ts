import React, { FC } from 'react';
import './CaravanSectionExploration.css';
import ExplorationResourcesPicker from '../ExplorationResourcesPicker/ExplorationResourcesPicker';
import { UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import { MainGameScreens } from '../../../App';

interface CaravanSectionExplorationProps {
  inventory:UniqueItemQuantitiesList;
  setInventory:(inventory:UniqueItemQuantitiesList)=>void;
  explorationInventory:UniqueItemQuantitiesList;
  setExplorationInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
  setMainGameScreen:React.Dispatch<React.SetStateAction<MainGameScreens>>
}

const CaravanSectionExploration: FC<CaravanSectionExplorationProps> = (
  {inventory, setInventory, explorationInventory, setExplorationInventory, setMainGameScreen}
) => (
  <div className="caravan-section-exploration" data-testid="caravan-section-exploration">
    <div className='resource-picker-parent'>
      <ExplorationResourcesPicker
        inventory={inventory}
        setInventory={setInventory}
        explorationInventory={explorationInventory}
        setExplorationInventory={setExplorationInventory}
      ></ExplorationResourcesPicker>
      <button className='venture-out-button'
        onClick={() => {
          setMainGameScreen(MainGameScreens.MAP);
        }}
      >Venture Out</button>
    </div>
    <div className='character-display'>
{`
            @@@@@@                    
           @@@@@@@@                   
           @@@@@@@@                   
            @@@@@@                    
           @@@@@@@@                   
       @@@@@@@@@@@@@@@                
      @@@@@@@@@@@@@@@@@               
     @@@@@@@@@@@@@@@@@@@              
    @@@@@@@@@@@@@@@@@@@@@             
   @@@@@@ @@@@@@@@@ @@@@@@            
   @@@@@   @@@@@@@@   @@@@@           
   @@@@    @@@@@@@@   @@@@@           
   @@@@    @@@@@@@    @@@@@           
   @@@@   @@@@@@@@@   @@@@@           
    @    @@@@@@@@@@@    @@            
         @@@@@ @@@@@                  
        @@@@@   @@@@@                 
       @@@@@     @@@@@                
       @@@@@     @@@@@                
       @@@@@     @@@@@                
       @@@@       @@@@                
      @@@@         @@@@               
`}
    </div>
  </div>
);

export default CaravanSectionExploration;
