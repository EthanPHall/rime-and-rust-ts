import React, { FC } from 'react';
import './CaravanSectionExploration.css';
import ExplorationResourcesPicker from '../ExplorationResourcesPicker/ExplorationResourcesPicker';

interface CaravanSectionExplorationProps {}

const CaravanSectionExploration: FC<CaravanSectionExplorationProps> = () => (
  <div className="caravan-section-exploration" data-testid="caravan-section-exploration">
    <ExplorationResourcesPicker></ExplorationResourcesPicker>
    <div className='character-display'>
{`                                                
                    ####                        
                  #########                     
                ############                    
                ############                    
                ############                    
                ############                    
                 ##########                     
                   ######                       
              #################                 
           ######################               
         ##########################             
        ############################            
       ##############################           
       ##############################           
      ################################          
    #########  ##############  #########        
    ########   ##############   ########        
    #######     ############     #######        
   #######      ############      #######       
   ######       ############       ######       
   ######       ############       ######       
  #######        ##########        #######      
  ######        ############        ######      
  ######       ##############       ######      
   ####       ################       ####       
             ##################                 
             ########  ########                 
            ########    ########                
           ########      ########               
           #######        #######               
          ######            ######              
          #######          #######              
          #######          #######              
          #######          #######              
          ######            ######              
          ######            ######              
          #####              #####              
         ######              ######             
      `}
    </div>
  </div>
);

export default CaravanSectionExploration;
