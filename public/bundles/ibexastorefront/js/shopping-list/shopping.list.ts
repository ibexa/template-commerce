import ShoppingList from '@ibexa-shopping-list/src/bundle/Resources/public/js/component/shopping.list';
import { errorHandler } from '../helper/error.helper';

export default class StorefrontShoppingList extends ShoppingList {
    loadShoppingLists(...args: Parameters<ShoppingList['loadShoppingLists']>) {
        const shoppingListsLoaded = super.loadShoppingLists(...args);

        shoppingListsLoaded.catch(errorHandler);

        return shoppingListsLoaded;
    }
    // TODO: add error handlers to other functions
}
