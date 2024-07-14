import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanSectionSleds.css';
import { Sled } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import { IItemFactory, Recipe, SledDogQuantity, SledQuantity } from '../../../classes/caravan/Item';
import { ItemFactoryContext } from '../../../App';
import Popup from 'reactjs-popup';
import IdGenerator from '../../../classes/utility/IdGenerator';

interface CaravanSectionSledsProps {
  sleds:Sled[];
  setSleds:React.Dispatch<React.SetStateAction<Sled[]>>;
  dogs:SledDogQuantity[];
  workers:number;
  setWorkers:React.Dispatch<React.SetStateAction<number>>
  executeRecipe:(recipe:Recipe) => void;
  sellSled:(sled:Sled) => void;
}

const CaravanSectionSleds: FC<CaravanSectionSledsProps> = ({sleds, setSleds, dogs, workers, setWorkers, executeRecipe, sellSled}) => {
  const SLED_MAX_WORKERS = 10;
  
  const itemFactory:IItemFactory = useContext(ItemFactoryContext);

  function removeWorkersFromSled(sled:Sled, amount:number){
    if(sled.getWorkers() >= amount){
      sled.setWorkers(sled.getWorkers() - amount);
      setWorkers(workers + amount);
      setSleds([...sleds]);
    }
  }
  function addWorkersToSled(sled:Sled, amount:number){
    if(workers >= amount && sled.getWorkers() + amount <= SLED_MAX_WORKERS){
      sled.setWorkers(sled.getWorkers() + amount);
      setWorkers(workers - amount);
      setSleds([...sleds]);
    }
  }


  
  // Split sleds into groups of 3
  const sledGroups:Sled[][] = [];
  sleds.forEach((sled, i) => {
      if(i % 3 == 0){
        sledGroups.push([sled]);
      }
      else{
        sledGroups[sledGroups.length - 1].push(sled);
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
<Popup
trigger=
{
<div className='sled'>
    {sled.getName()}
    <br/>    
    {sled.getWorkers()}/{SLED_MAX_WORKERS}     
    {`
                      +#+
++-                 ++-##+
  ++++-        -+++-+++##+
  +++++++++++++++++-+++##+
      +++#+++#######+     
    `} 
</div>
}

position={['bottom center', 'top center']}

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
    <div className='passive-recipe-section'>
      <div className='resources-separator'></div>
      {
        sled.getWorkerAdjustedPassiveRecipe(itemFactory).getCosts().map((cost, index) => {
          return (
            <div key={`passive-recipe-costs-entry-${index}`} className='passive-recipe-entry'>
              <div className='cost-name'>{cost.getBaseItem().getName()}:</div>
              <div className='cost-amount'>-{cost.getQuantity()}</div>
            </div>
          )
        })
      }
      <div className='resources-separator'></div>
      {
        sled.getWorkerAdjustedPassiveRecipe(itemFactory).getResults().map((cost, index) => {
          return (
            <div key={`passive-recipe-result-entry-${index}`} className='passive-recipe-entry'>
              <div className='result-name'>{cost.getBaseItem().getName()}:</div>
              <div className='result-amount'>+{cost.getQuantity()}</div>
            </div>
          )
        })
      }
    </div>
    <div className='sell-section'>
      <button onClick={() => {sellSled(sled)}}>Sell</button>
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
    <div className='survivors-count'>Survivors: {workers}, Sleds: {sleds.length}</div>
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
