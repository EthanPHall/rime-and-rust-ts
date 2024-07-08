import React, { FC, useContext } from 'react';
import './CaravanSectionSleds.css';
import { Sled } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import { Recipe, SledDogQuantity, SledQuantity } from '../../../classes/caravan/Item';
import { ItemFactoryContext } from '../../../App';

interface CaravanSectionSledsProps {
  sleds:SledQuantity[];
  dogs:SledDogQuantity[];
  workers:number;
  executeRecipe:(recipe:Recipe) => void;
}

const CaravanSectionSleds: FC<CaravanSectionSledsProps> = ({sleds, dogs, workers, executeRecipe}) => {
  // Split sleds into groups of 3
  const sledGroups:Sled[][] = [];
  sleds.forEach((sledQuantity) => {
    for(let i = 0; i < sledQuantity.getQuantity(); i++){
      if(i % 3 == 0){
        console.log('Adding new sled group');
        sledGroups.push([sledQuantity.getSled()]);
      }
      else{
        console.log('Adding sled to existing group');
        sledGroups[sledGroups.length - 1].push(sledQuantity.getSled());
      }
    }
  });

  function sledGroupToJSX(group:Sled[]):JSX.Element{
    return(
    <>
        {
          group.map((sled, index) => {
            return (
<>
  {index == 0 && <div className='sled-dog'>
  {`
  #--          -.-       
  +###+++        #+.      
+---.-#+#+###+##+--       
  -  +++--+++#++-..       
      -----+---++--       
    ---...    -----..-.   
  ..--.               ----
  `} 
</div>}
{index == 0 && <div className='connecting-arrow'>
{`
  
  
  
--->
  
  
  
`}
</div>}
<div className='sled'>
    {sled.getName()}     
    {`
    
                      +++ 
                      +#+
++-                 ++-##+
  ++++-        -+++-+++##+
  +++++++++++++++++-+++##+
      +++#+++#######+     
    `} 
</div>
{index < group.length - 1 && <div className='connecting-arrow'>
{`
  
  
  
--->
  
  
  
`}
</div>}         
</>
            )
          }
        )
        }
      </>
    )
  }

  return (<div className="caravan-section-sleds" data-testid="caravan-section-sleds">
    <div className='survivors-count'>Survivors: {workers}, Sleds: {sleds.map((sledQuant) => {return sledQuant.getQuantity()}).reduce((p, c) => {return p + c}, 0)}</div>
    {
      sledGroups.map((group) => {
        return (
          <div className='train'>
            {
              sledGroupToJSX(group)
            }
          </div>
        )
      })
    }
    {/* <div className='train'>
      <div className='sled-space'>
        {`
        Empty Space
        ____________________
        `} 
      </div>
    </div> */}
  </div>
);
}

export default CaravanSectionSleds;
