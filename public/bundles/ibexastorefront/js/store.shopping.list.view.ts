import {
    initAddSingleToCart,
    initAddToShoppingList,
    initDeleteShoppingListModal,
    initDeleteSingleEntry,
} from './store.shopping.list.common';

(function () {
    initDeleteSingleEntry();
    initAddSingleToCart();
    initAddToShoppingList();
    initDeleteShoppingListModal();
})();
