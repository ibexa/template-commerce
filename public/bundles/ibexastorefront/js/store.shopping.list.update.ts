import { initAddSingleToCart, initAddToShoppingList, initDeleteSingleEntry } from './store.shopping.list.common';

(function (global, doc) {
    initDeleteSingleEntry();
    initAddSingleToCart();
    initAddToShoppingList();

    const productsBulkCheckbox = doc.querySelector<HTMLInputElement>('.ibexa-store-shopping-list-update__products-bulk-checkbox');
    const productBulkCheckboxes = doc.querySelectorAll<HTMLInputElement>('.ibexa-store-shopping-list-update__product-bulk-checkbox');
    const deleteSelectedProductsBtn = doc.querySelector<HTMLButtonElement>(
        '.ibexa-store-shopping-list-update__delete-selected-products-btn',
    );
    const addToCartSelectedProductsBtn = doc.querySelector<HTMLButtonElement>(
        '.ibexa-store-shopping-list-update__add-to-cart-selected-products-btn',
    );

    if (productsBulkCheckbox) {
        const updateProductsBulkCheckboxStatus = () => {
            const selectedProductBulkCheckboxes = doc.querySelectorAll<HTMLInputElement>(
                '.ibexa-store-shopping-list-update__product-bulk-checkbox:checked',
            );

            productsBulkCheckbox.checked = selectedProductBulkCheckboxes.length !== 0;
            productsBulkCheckbox.indeterminate =
                selectedProductBulkCheckboxes.length < productBulkCheckboxes.length && selectedProductBulkCheckboxes.length !== 0;
        };

        const updateProductsDeleteBulkBtnStatus = () => {
            const selectedProductDeleteCheckboxes = doc.querySelectorAll<HTMLInputElement>(
                '.ibexa-store-shopping-list-update__product-bulk-checkbox:checked',
            );

            if (deleteSelectedProductsBtn) {
                deleteSelectedProductsBtn.disabled = selectedProductDeleteCheckboxes.length === 0;
            }

            if (addToCartSelectedProductsBtn) {
                addToCartSelectedProductsBtn.disabled = selectedProductDeleteCheckboxes.length === 0;
            }
        };

        const updateRealFormsCheckboxes = (entryId: string, shouldBeChecked: boolean) => {
            const removeCheckbox = doc.querySelector<HTMLInputElement>(`[name="shopping_list_remove_entries[entries][${entryId}]"]`);

            if (removeCheckbox) {
                removeCheckbox.checked = shouldBeChecked;
            }

            const addToShoppingListCheckbox = doc.querySelector<HTMLInputElement>(
                `[name="selected_shopping_list_entries[entries][${entryId}]"]`,
            );

            if (addToShoppingListCheckbox) {
                addToShoppingListCheckbox.checked = shouldBeChecked;
            }
        };

        productsBulkCheckbox.addEventListener(
            'change',
            () => {
                productBulkCheckboxes.forEach((checkbox) => {
                    const { shoppingListEntryIdentifier } = checkbox.dataset;

                    // eslint-disable-next-line no-param-reassign
                    checkbox.checked = productsBulkCheckbox.checked;

                    if (shoppingListEntryIdentifier) {
                        updateRealFormsCheckboxes(shoppingListEntryIdentifier, productsBulkCheckbox.checked);
                    }
                }, false);

                updateProductsDeleteBulkBtnStatus();
            },
            false,
        );

        updateProductsBulkCheckboxStatus();
        updateProductsDeleteBulkBtnStatus();

        productBulkCheckboxes.forEach((checkbox) => {
            const { shoppingListEntryIdentifier } = checkbox.dataset;

            checkbox.addEventListener(
                'change',
                () => {
                    updateProductsBulkCheckboxStatus();
                    updateProductsDeleteBulkBtnStatus();

                    if (shoppingListEntryIdentifier) {
                        updateRealFormsCheckboxes(shoppingListEntryIdentifier, checkbox.checked);
                    }
                },
                false,
            );
        });
    }
})(window, window.document);
