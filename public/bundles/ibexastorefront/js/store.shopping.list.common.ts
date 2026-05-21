export const initDeleteSingleEntry = (): void => {
    const doc = window.document;
    const shoppingListEntryDeleteForm = doc.querySelector<HTMLFormElement>('form[name=shopping_list_remove_entries]');
    const deleteShoppingListEntryBtns = doc.querySelectorAll<HTMLButtonElement>(
        '.ibexa-store-shopping-list__delete-shopping-list-entry-btn',
    );

    if (!shoppingListEntryDeleteForm) {
        return;
    }

    deleteShoppingListEntryBtns.forEach((deleteShoppingListEntryBtn) => {
        deleteShoppingListEntryBtn.addEventListener(
            'click',
            () => {
                const { shoppingListEntryIdentifier } = deleteShoppingListEntryBtn.dataset;
                const checkboxes = shoppingListEntryDeleteForm.querySelectorAll<HTMLInputElement>(
                    '#shopping_list_remove_entries_entries input[type="checkbox"]',
                );

                checkboxes.forEach((checkbox) => {
                    // eslint-disable-next-line no-param-reassign
                    checkbox.checked = checkbox.name === `shopping_list_remove_entries[entries][${shoppingListEntryIdentifier}]`;
                }, false);

                shoppingListEntryDeleteForm.submit();
            },
            false,
        );
    });
};

export const initAddSingleToCart = (): void => {
    const doc = window.document;
    const selectedShoppingListEntriesForm = doc.querySelector<HTMLFormElement>('form[name=selected_shopping_list_entries]');
    const addProductToCartBtns = doc.querySelectorAll<HTMLButtonElement>('.ibexa-store-shopping-list__add-product-to-cart-btn');

    if (!selectedShoppingListEntriesForm) {
        return;
    }

    addProductToCartBtns.forEach((addProductToCartBtn) => {
        addProductToCartBtn.addEventListener(
            'click',
            () => {
                const { shoppingListEntryIdentifier } = addProductToCartBtn.dataset;
                const checkboxes = selectedShoppingListEntriesForm.querySelectorAll<HTMLInputElement>(
                    '#selected_shopping_list_entries_entries input[type="checkbox"]',
                );

                checkboxes.forEach((checkbox) => {
                    // eslint-disable-next-line no-param-reassign
                    checkbox.checked = checkbox.name === `selected_shopping_list_entries[entries][${shoppingListEntryIdentifier}]`;
                }, false);

                selectedShoppingListEntriesForm.submit();
            },
            false,
        );
    });
};

export const initAddToShoppingList = (): void => {
    const doc = window.document;
    const addToShoppingListBtns = doc.querySelectorAll<HTMLButtonElement>('.ibexa-store-shopping-list__add-to-shopping-list-btn');

    addToShoppingListBtns.forEach((addToShoppingListBtn) => {
        const { modalId } = addToShoppingListBtn.dataset;

        if (!modalId) {
            return;
        }

        const addToShoppingListModalNode = doc.querySelector<HTMLDivElement>(`#${modalId}`);

        if (!addToShoppingListModalNode) {
            return;
        }

        const openModal = () => {
            addToShoppingListModalNode.dispatchEvent(new CustomEvent('ibexa-store-modal:open'));
        };

        addToShoppingListBtn.addEventListener(
            'click',
            () => {
                openModal();
            },
            false,
        );

        addToShoppingListModalNode.addEventListener(
            'ibexa-store-modal:closed',
            () => {
                const shoppingLists = window.ibexaShoppingList?.getShoppingLists();
                const { currentShoppingListIdentifier, productCode } = addToShoppingListBtn.dataset;
                const currentShoppingList = shoppingLists?.ShoppingList.find(
                    (shoppingList) => shoppingList.identifier === currentShoppingListIdentifier,
                );
                const isProductStillInCurrentList = currentShoppingList?.entries?.find(
                    (shoppingListEntry) => shoppingListEntry.product.code === productCode,
                );

                if (!isProductStillInCurrentList) {
                    window.location.reload();
                }
            },
            false,
        );
    });
};

const initDeleteModalHandlers = (deleteShoppingListConfirmationModalNode: HTMLDivElement, shoppingListDeleteForm: HTMLFormElement) => {
    const modalConfirmBtn = deleteShoppingListConfirmationModalNode.querySelector<HTMLButtonElement>(
        '.ibexa-store-delete-shopping-list-confirmation-modal__confirm-btn',
    );
    const modalCancelBtn = deleteShoppingListConfirmationModalNode.querySelector<HTMLButtonElement>(
        '.ibexa-store-delete-shopping-list-confirmation-modal__cancel-btn',
    );

    const openModal = () => {
        deleteShoppingListConfirmationModalNode.dispatchEvent(new CustomEvent('ibexa-store-modal:open'));
    };
    const closeModal = () => {
        deleteShoppingListConfirmationModalNode.dispatchEvent(new CustomEvent('ibexa-store-modal:close'));
    };

    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeModal, false);
    }

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener(
            'click',
            () => {
                shoppingListDeleteForm.submit();
            },
            false,
        );
    }

    return { closeModal, openModal };
};

export const initDeleteShoppingListModal = (): void => {
    const doc = window.document;
    const shoppingListDeleteForm = doc.querySelector<HTMLFormElement>('[name=shopping_list_delete]');
    const deleteShoppingListConfirmationModalNode = doc.querySelector<HTMLDivElement>(
        '.ibexa-store-delete-shopping-list-confirmation-modal',
    );

    if (!shoppingListDeleteForm || !deleteShoppingListConfirmationModalNode) {
        return;
    }

    const deleteShoppingListBtn = shoppingListDeleteForm.querySelector<HTMLButtonElement>(
        '.ibexa-store-shopping-list-view__delete-shopping-list-btn',
    );

    const { openModal } = initDeleteModalHandlers(deleteShoppingListConfirmationModalNode, shoppingListDeleteForm);

    if (deleteShoppingListBtn) {
        deleteShoppingListBtn.addEventListener('click', openModal, false);
    }
};
