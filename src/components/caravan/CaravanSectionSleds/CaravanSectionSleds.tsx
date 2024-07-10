import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanSectionSleds.css';
import { Sled } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import { IItemFactory, Recipe, SledDogQuantity, SledQuantity } from '../../../classes/caravan/Item';
import { ItemFactoryContext } from '../../../App';
import Popup from 'reactjs-popup';
import IdGenerator from '../../../classes/utility/IdGenerator';

interface CaravanSectionSledsProps {
  sledQuantities:SledQuantity[];
  updateSledWorkers:(sledsToUpdate:Sled[]) => void;
  dogs:SledDogQuantity[];
  workers:number;
  setWorkers:React.Dispatch<React.SetStateAction<number>>
  executeRecipe:(recipe:Recipe) => void;
}

const CaravanSectionSleds: FC<CaravanSectionSledsProps> = ({sledQuantities, updateSledWorkers, dogs, workers, setWorkers, executeRecipe}) => {
  const itemFactory:IItemFactory = useContext(ItemFactoryContext);
  
  function removeWorkersFromSled(sled:Sled, amount:number){
    const newSledsList = [...sledQuantities];
    if(sled.getWorkers() >= amount){
      const sledToChange = newSledsList.find((currentSledQuantity) => {
        return currentSledQuantity.getBaseSled().getId() == sled.getId();
      });

      if(sledToChange){
        sledToChange.getBaseSled().setWorkers(sledToChange.getBaseSled().getWorkers() - amount);

        updateSledWorkers(newSledsList.map((sledQuantity) => {return sledQuantity.getBaseSled()}));
        setWorkers(workers + amount);
      }
    }
  }
  function addWorkersToSled(sled:Sled, amount:number){
    const newSledQuantitiesList = [...sledQuantities];
    if(workers >= amount){
      const sledQuantityToChange:SledQuantity|undefined = newSledQuantitiesList.find((currentSledQuantity) => {
        return currentSledQuantity.getList().find((currentSled) => {
          return currentSled.getId() == sled.getId();
        });
      });

      if(sledQuantityToChange){
        const sledToChange:Sled|undefined = sledQuantityToChange.getSledById(sled.getId());
        sledToChange?.setWorkers(sledToChange.getWorkers() + amount);
      }
    }
    updateSledWorkers(newSledQuantitiesList.map((sledQuantity) => {return sledQuantity.getBaseSled()}));
    setWorkers(workers - amount);
  }


  
  // Split sleds into groups of 3
  const sledGroups:Sled[][] = [];
  sledQuantities.forEach((sledQuantity) => {
    sledQuantity.getList().forEach((sled, i) => {
      if(i % 3 == 0){
        sledGroups.push([sled]);
      }
      else{
        sledGroups[sledGroups.length - 1].push(sled);
      }
    });
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
<Popup
trigger=
{
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
}

on={['hover', 'focus']}
>
  <div className='tooltip'>
    Workers: {sled.getWorkers()}
    <div className='add-subtract-section'>
      <button onClick={() => {removeWorkersFromSled(sled, 1)}}>- workers</button>
      <button onClick={() => {addWorkersToSled(sled, 1)}}>+ workers</button>
    </div>
    <div className='add-subtract-section'>
      <button onClick={() => {removeWorkersFromSled(sled, 5)}}>-5 workers</button>
      <button onClick={() => {addWorkersToSled(sled, 5)}}>+5 workers</button>
    </div>
  </div>
</Popup>
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
    <div className='survivors-count'>Survivors: {workers}, Sleds: {sledQuantities.map((sledQuant) => {return sledQuant.getQuantity()}).reduce((p, c) => {return p + c}, 0)}</div>
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
