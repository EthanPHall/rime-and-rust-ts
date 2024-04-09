import React, { FC } from 'react';
import './CaravanSectionSleds.css';

interface CaravanSectionSledsProps {}

const CaravanSectionSleds: FC<CaravanSectionSledsProps> = () => (
  <div className="caravan-section-sleds" data-testid="caravan-section-sleds">
    <div className='survivors-count'>Survivors: #</div>
    <div className='train'>
      <div className='sled-dog'>
      {`
       #--          -.-       
       +###+++        #+.      
    +---.-#+#+###+##+--       
      -  +++--+++#++-..       
          -----+---++--       
        ---...    -----..-.   
      ..--.               ----
      `} 
      </div>
      <div className='connecting-arrow'>
      {`
    
    
    
--->
    
    
    
      `} 
      </div>
      <div className='sled'>
      {`
          Sled Name      
                        +++ 
                        +#+
 ++-                 ++-##+
   ++++-        -+++-+++##+
   +++++++++++++++++-+++##+
       +++#+++#######+     
      `} 
      </div>
      <div className='connecting-arrow'>
      {`
    
    
    
--->
    
    
    
      `} 
      </div>
      <div className='sled'>
      {`
          Sled Name      
                        +++ 
                        +#+
 ++-                 ++-##+
   ++++-        -+++-+++##+
   +++++++++++++++++-+++##+
       +++#+++#######+     
      `} 
      </div>
      <div className='connecting-arrow'>
      {`
    
    
    
--->
    
    
    
      `} 
      </div>
      <div className='sled'>
      {`
          Sled Name      
                        +++ 
                        +#+
 ++-                 ++-##+
   ++++-        -+++-+++##+
   +++++++++++++++++-+++##+
       +++#+++#######+     
      `} 
      </div>
    </div>
    <div className='train'>
      <div className='sled-dog'>
      {`
       #--          -.-       
       +###+++        #+.      
    +---.-#+#+###+##+--       
      -  +++--+++#++-..       
          -----+---++--       
        ---...    -----..-.   
      ..--.               ----
      `} 
      </div>
      <div className='connecting-arrow'>
      {`
    
    
    
--->
    
    
    
      `} 
      </div>
      <div className='sled'>
      {`
          Sled Name      
                        +++ 
                        +#+
 ++-                 ++-##+
   ++++-        -+++-+++##+
   +++++++++++++++++-+++##+
       +++#+++#######+     
      `} 
      </div>
    </div>
    <div className='train'>
      <div className='sled-dog'>
      {`
       #--          -.-       
       +###+++        #+.      
    +---.-#+#+###+##+--       
      -  +++--+++#++-..       
          -----+---++--       
        ---...    -----..-.   
      ..--.               ----
      `} 
      </div>
    </div>
    <div className='train'>
      <div className='sled-space'>
        {`
        Empty Space
        ____________________
        `} 
      </div>
    </div>
  </div>
);

export default CaravanSectionSleds;
