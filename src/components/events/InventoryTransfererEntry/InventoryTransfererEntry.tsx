import { FC } from "react";
import { IItem, ItemQuantity, UniqueItemQuantitiesList } from "../../../classes/caravan/Item";
import './InventoryTransfererEntry.css';

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
  
    function transferItems(from:UniqueItemQuantitiesList, to:UniqueItemQuantitiesList, key:string, amount:number) {
      //Does the key occur in the from list?
      const fromListItem:ItemQuantity|undefined = from.find((itemQuantity) => itemQuantity.getBaseItem().getKey() == key);
      if(!fromListItem) {
        //No, so return
        return;
      }
  
      //Does the from list have enough items to transfer?
      if(fromListItem.getQuantity() < amount) {
        //No, so return
        return;
      }
  
      const quantityToTransfer:number = Math.min(amount, fromListItem.getQuantity());
      
      //Does the key exist in To? If so, add to the quantity. If not, add a new item quantity.
      to.modify(new ItemQuantity(fromListItem.getBaseItem(), quantityToTransfer));
      from.modify(new ItemQuantity(fromListItem.getBaseItem(), -quantityToTransfer));
    }
  
    return (
    <div className="inventory-transferer-entry">
      <div className='resource-name'>{itemToDisplay.getName()}:</div>
      <div className='amount-and-increments'>
        <div className='resource-amount'>{fromInventory.find((itemQuantity) => {return itemQuantity.getBaseItem().getKey() == itemToDisplay.getKey()})?.getQuantity()}</div>
        <div className='increment-decrement'>
          <button className='resource-increment' onClick={
            () => {
              transferItems(fromInventory, toInventory, itemToDisplay.getKey(), 1);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>+</button>
          <button className='resource-decrement' onClick={
            () => {
              transferItems(toInventory, fromInventory, itemToDisplay.getKey(), 1);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>-</button>
        </div>
        <div className='increment-decrement'>
          <button className='resource-increment-large' onClick={
            () => {
              transferItems(fromInventory, toInventory, itemToDisplay.getKey(), 5);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>+</button>
          <button className='resource-decrement-large' onClick={
            () => {
              transferItems(toInventory, fromInventory, itemToDisplay.getKey(), 5);
              setFromInventory(fromInventory.clone());
              setToInventory(toInventory.clone());
            }
          }>-</button>
        </div>
      </div>
    </div>
  );}
  
  export default InventoryTransfererEntry;
  