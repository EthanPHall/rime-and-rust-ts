import { ItemQuantity, UniqueItemQuantitiesList } from "../caravan/Item";

function transferItems(from:UniqueItemQuantitiesList, to:UniqueItemQuantitiesList, key:string, amount:number) {

    //Does the key occur in the from list?
    const fromListItem:ItemQuantity|undefined = from.find((itemQuantity) => itemQuantity.getBaseItem().getKey() == key);
    if(!fromListItem) {
      //No, so return
      return;
    }
    
    const quantityToTransfer:number = Math.min(amount, fromListItem.getQuantity());
    // //Does the from list have enough items to transfer?
    // if(fromListItem.getQuantity() < quantityToTransfer) {
      //   //No, so return
      //   return;
      // }
      
      
    //Does the key exist in To? If so, add to the quantity. If not, add a new item quantity.
    for(let i = 0; i < quantityToTransfer; i++){
      if(to.capacityReached()){
        break;
      }

      to.modify(new ItemQuantity(fromListItem.getBaseItem(), 1));
      from.modify(new ItemQuantity(fromListItem.getBaseItem(), -1));
    }
  }

  export default transferItems;