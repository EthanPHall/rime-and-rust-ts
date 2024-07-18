import { useEffect, useState } from "react";
import { ItemQuantity, UniqueItemQuantitiesList } from "../../classes/caravan/Item";
import explorationItems from "../../data/caravan/exploration-items.json";

const useExplorationInventory = (
    regularInventory: UniqueItemQuantitiesList
) => {
    const [explorationInventory, setExplorationInventory] = useState<UniqueItemQuantitiesList>(new UniqueItemQuantitiesList([]));

    useEffect(() => {
        regularInventory.forEach((itemQuantity) => {
            //Is the current itemQuantity in the explorationItems list?
            if(explorationItems.includes(itemQuantity.getBaseItem().getKey())) {
                //Yes, so make sure that the explorationInventory includes an entry for that item.
                explorationInventory.modify(new ItemQuantity(itemQuantity.getBaseItem(), 0));
            }
        });
    }, [regularInventory]);

    return {explorationInventory, setExplorationInventory};
}

export default useExplorationInventory