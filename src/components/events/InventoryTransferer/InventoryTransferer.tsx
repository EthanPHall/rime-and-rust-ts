import { FC } from "react";
import { ItemQuantity, UniqueItemQuantitiesList } from "../../../classes/caravan/Item";
import InventoryTransfererEntry from "../InventoryTransfererEntry/InventoryTransfererEntry";
import './InventoryTransferer.css';
import SectionLabel from "../../misc/SectionLabel/SectionLabel";

interface InventoryTransfererProps {
    fromInventory:UniqueItemQuantitiesList;
    setFromInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
    toInventory:UniqueItemQuantitiesList;
    setToInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
  }
  
  const InventoryTransferer: FC<InventoryTransfererProps> = (
    {fromInventory, setFromInventory, toInventory, setToInventory}
  ) =>{
  
    return (
    <div className="inventory-transferer">
      {fromInventory.getMaxCapacity() != Infinity && `${fromInventory.getCurrentCapacity()}/${fromInventory.getMaxCapacity()}`}
      {fromInventory.getListCopy().map((itemQuantity) => {
        return <InventoryTransfererEntry
          fromInventory={fromInventory}
          setFromInventory={setFromInventory}
          toInventory={toInventory}
          setToInventory={setToInventory}
          itemToDisplay={itemQuantity.getBaseItem()}
        ></InventoryTransfererEntry>
      })}
    </div>
  );}
  
  export default InventoryTransferer;
  