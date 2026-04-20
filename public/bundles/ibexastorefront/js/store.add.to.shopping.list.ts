import { StorefrontAddToShoppingList } from './shopping-list/add.to.shopping.list';

(function (global: Window, doc: Document) {
    const addToShoppingListsNodes = doc.querySelectorAll<HTMLDivElement>('.ibexa-store-add-to-shopping-list');

    addToShoppingListsNodes.forEach((addToShoppingListNode) => {
        const addToShoppingList = new StorefrontAddToShoppingList({ node: addToShoppingListNode });

        addToShoppingList.init();
    });
})(window, window.document);
