import React, { FC } from 'react';
import './CaravanSectionExploration.css';
import ExplorationResourcesPicker from '../ExplorationResourcesPicker/ExplorationResourcesPicker';

interface CaravanSectionExplorationProps {}

const CaravanSectionExploration: FC<CaravanSectionExplorationProps> = () => (
  <div className="caravan-section-exploration" data-testid="caravan-section-exploration">
    <div className='resource-picker-parent'>
      <ExplorationResourcesPicker></ExplorationResourcesPicker>
      <button className='venture-out-button'>Venture Out</button>
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
