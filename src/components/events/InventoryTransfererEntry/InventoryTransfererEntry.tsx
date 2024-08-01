import { FC } from "react";
import { IItem, ItemQuantity, UniqueItemQuantitiesList } from "../../../classes/caravan/Item";
import './InventoryTransfererEntry.css';
import transferItems from "../../../classes/utility/transferItems";

interface InventoryTransfererEntryProps {
    fromInventory:UniqueItemQuantitiesList;
    setFromInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
    toInventory:UniqueItemQuantitiesList;
    setToInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
    itemToDisplay:IItem;
  }
  
  const InventoryTransfererEntry: FC<InventoryTransfererEntryProps> = (
    {fromInventory, setFromInventory, toInventory, setToInventory, itemToDisplay}
  ) => {
  
    return (
    <div className="inventory-transferer-entry">
      <div className='resource-name'>{itemToDisplay.getName()}:</div>
      <div className='amount-and-increments'>
        <div className='resource-amount'>{fromInventory.find((itemQuantity) => {return itemQuantity.getBaseItem().getKey() == itemToDisplay.getKey()})?.getQuantity()}</div>
        <div className='increment-decrement'>
          <button className='resource-increment' onClick={
            () => {
              transferItems(toInventory, fromInventory, itemToDisplay.getKey(), 1);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>+</button>
          <button className='resource-decrement' onClick={
            () => {
              transferItems(fromInventory, toInventory, itemToDisplay.getKey(), 1);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>-</button>
        </div>
        <div className='increment-decrement'>
          <button className='resource-increment-large' onClick={
            () => {
              transferItems(toInventory, fromInventory, itemToDisplay.getKey(), 5);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>+</button>
          <button className='resource-decrement-large' onClick={
            () => {
              transferItems(fromInventory, toInventory, itemToDisplay.getKey(), 5);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>-</button>
        </div>
      </div>
    </div>
  );}
  
  export default InventoryTransfererEntry;
  