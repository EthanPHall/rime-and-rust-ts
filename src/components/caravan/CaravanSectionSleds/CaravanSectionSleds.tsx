import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanSectionSleds.css';
import { Sled } from '../CaravanSectionCrafting/CaravanSectionCrafting';
import { IItemFactory, Recipe, SledDogQuantity, SledQuantity } from '../../../classes/caravan/Item';
import { ItemFactoryContext } from '../../../App';
import Popup from 'reactjs-popup';
import IdGenerator from '../../../classes/utility/IdGenerator';

interface CaravanSectionSledsProps {
  sledQuantities:SledQuantity[];
  dogs:SledDogQuantity[];
  workers:number;
  setWorkers:React.Dispatch<React.SetStateAction<number>>
  executeRecipe:(recipe:Recipe) => void;
}

const CaravanSectionSleds: FC<CaravanSectionSledsProps> = ({sledQuantities, dogs, workers, setWorkers, executeRecipe}) => {
  const itemFactory:IItemFactory = useContext(ItemFactoryContext);
  
  type SledPlusId = {
    id:number;
    sled:Sled;
  }
  const [sleds, setSleds] = useState<SledPlusId[]>([]);
  useEffect(() => {
    let newSledsList:SledPlusId[] = [];

    if(sleds.length == 0){
      sledQuantities.forEach((quantity) => {
        for(let i = 0; i < quantity.getQuantity(); i++){
          newSledsList.push(
            {
              id: IdGenerator.generateUniqueId(),
              sled: itemFactory.createItem(quantity.getSled().getKey()) as Sled
            }
          );
        }
      });
    }
    else{
      //There are already sleds, and their data needs to be preserved.
      //So, foreach quantity, filter the sleds list for sleds of that quantity's type.
      //Once we have that list (currentList), we keep track of it in another list[][] (aggregateList).
      //With currentList, does the length equal the quantity's quantity? If so, move on. If it's less than the quantity, 
      //make a new sled and push it onto the currentList. If it's greater than, then I've messed up elsewhere, because 
      //there's no way to know which extra sled to delete. If there's ever another cmponent that can add/delete sleds,
      //this algorithm will need to be revisited.

      const aggregateList:SledPlusId[][] = [];
      sledQuantities.forEach((quantity) => {
        const filteredList = sleds.filter((sledPlusId) => {
          return sledPlusId.sled.getKey() == quantity.getSled().getKey();
        });

        if(filteredList.length < quantity.getQuantity()){
          filteredList.push({
              id: IdGenerator.generateUniqueId(),
              sled: itemFactory.createItem(quantity.getSled().getKey()) as Sled
            }
          )
        }
        else if (filteredList.length > quantity.getQuantity()){
          console.log("CaravanSectionSleds: useEffect[sledQuantities]: Can't determine which sled to delete.");
        }

        aggregateList.push(filteredList);
      });

      newSledsList = aggregateList.reduce<SledPlusId[]>((p, c) => {
        return [...p, ...c];
      }, []);
    }
    
    setSleds(newSledsList);
  }, [sledQuantities]);



  function removeWorkersFromSled(sledPlusId:SledPlusId, amount:number){
    const newSledsList = [...sleds];
    if(sledPlusId.sled.getWorkers() >= amount){
      const sledToChange = newSledsList.find((currentSledId) => {
        return currentSledId.id == sledPlusId.id;
      });

      if(sledToChange){
        sledToChange.sled.setWorkers(sledToChange.sled.getWorkers() - amount);

        setSleds(newSledsList);
        setWorkers(workers + amount);
      }
    }
  }
  function addWorkersToSled(sledPlusId:SledPlusId, amount:number){
    const newSledsList = [...sleds];
    if(workers >= amount){
      const sledToChange = newSledsList.find((currentSledId) => {
        return currentSledId.id == sledPlusId.id;
      });

      if(sledToChange){
        sledToChange.sled.setWorkers(sledToChange.sled.getWorkers() + amount);

        setSleds(newSledsList);
        setWorkers(workers - amount);
      }
    }
  }


  
  // Split sleds into groups of 3
  const sledGroups:SledPlusId[][] = [];
  sleds.forEach((sledPlusId, i) => {
    if(i % 3 == 0){
      console.log('Adding new sled group');
      sledGroups.push([sledPlusId]);
    }
    else{
      console.log('Adding sled to existing group');
      sledGroups[sledGroups.length - 1].push(sledPlusId);
    }
  });

  function sledGroupToJSX(group:SledPlusId[]):JSX.Element{
    return(
    <>
        {
          group.map((sledPlusId, index) => {
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
    {sledPlusId.sled.getName()}     
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
    Workers: {sledPlusId.sled.getWorkers()}
    <div className='add-subtract-section'>
      <button onClick={() => {removeWorkersFromSled(sledPlusId, 1)}}>- workers</button>
      <button onClick={() => {addWorkersToSled(sledPlusId, 1)}}>+ workers</button>
    </div>
    <div className='add-subtract-section'>
      <button onClick={() => {removeWorkersFromSled(sledPlusId, 5)}}>-5 workers</button>
      <button onClick={() => {addWorkersToSled(sledPlusId, 5)}}>+5 workers</button>
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
