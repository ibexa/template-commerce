import { NotificationDetail } from './store.notifications';

(function (global, doc) {
    const filtersFormNode = doc.querySelector<HTMLFormElement>('.ibexa-store-shopping-list-list__filters');
    const submitFiltersForm = () => {
        filtersFormNode?.submit();
    };
    const shoppingListDeleteBtns = doc.querySelectorAll<HTMLButtonElement>('[data-delete-shopping-list-identifier]');
    const deleteShoppingListsForm = doc.querySelector<HTMLFormElement>('[name=shopping_list_bulk_delete]');
    const deleteShoppingListsCheckboxes = doc.querySelectorAll<HTMLInputElement>('#shopping_list_bulk_delete_shoppingLists input');
    const sortFieldWithDirectionSelect = doc.querySelector<HTMLSelectElement>(
        '.ibexa-store-shopping-list-list__filters-sort-field-with-direction-field',
    );
    const sortFieldInput = filtersFormNode?.querySelector<HTMLSelectElement>('.ibexa-store-shopping-list-list__filters-sort-field');
    const sortDirectionFieldInput = filtersFormNode?.querySelector<HTMLSelectElement>(
        '.ibexa-store-shopping-list-list__filters-sort-direction-field',
    );
    const deleteShoppingListConfirmationModalNode = doc.querySelector<HTMLDivElement>(
        '.ibexa-store-delete-shopping-list-confirmation-modal',
    );
    const createBtn = doc.querySelector<HTMLButtonElement>('.ibexa-store-shopping-lists__create-action');

    if (createBtn) {
        createBtn.addEventListener(
            'click',
            (event) => {
                if (!createBtn.dataset.blockClick) {
                    return;
                }

                event.preventDefault();

                document.body.dispatchEvent(
                    new CustomEvent<NotificationDetail>('ibexa-store-notify', {
                        detail: { label: null, message: createBtn.dataset.blockClick, type: 'error' },
                    }),
                );
            },
            false,
        );
    }

    if (sortFieldWithDirectionSelect && sortFieldInput && sortDirectionFieldInput) {
        const handleSortDirectionSelectChange = () => {
            const selectedValue = sortFieldWithDirectionSelect.value;

            switch (selectedValue) {
                case 'created_at_asc':
                case 'created_at_desc':
                    sortFieldInput.value = 'created_at';
                    break;
                case 'updated_at_asc':
                case 'updated_at_desc':
                    sortFieldInput.value = 'updated_at';
                    break;
                case 'name_asc':
                case 'name_desc':
                    sortFieldInput.value = 'name';
                    break;
                default:
                    break;
            }

            switch (selectedValue) {
                case 'created_at_asc':
                case 'updated_at_asc':
                case 'name_asc':
                    sortDirectionFieldInput.value = 'asc';
                    break;
                case 'created_at_desc':
                case 'updated_at_desc':
                case 'name_desc':
                    sortDirectionFieldInput.value = 'desc';
                    break;
                default:
                    break;
            }

            submitFiltersForm();
        };

        sortFieldWithDirectionSelect.addEventListener('change', handleSortDirectionSelectChange, false);
    }

    if (deleteShoppingListsForm && deleteShoppingListConfirmationModalNode) {
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
            modalCancelBtn.addEventListener(
                'click',
                () => {
                    closeModal();
                },
                false,
            );
        }

        if (modalConfirmBtn) {
            modalConfirmBtn.addEventListener(
                'click',
                () => {
                    deleteShoppingListsForm.submit();
                },
                false,
            );
        }

        shoppingListDeleteBtns.forEach((btn) => {
            btn.addEventListener(
                'click',
                () => {
                    const identifier = btn.dataset.deleteShoppingListIdentifier;

                    if (identifier) {
                        deleteShoppingListsCheckboxes.forEach((checkbox) => {
                            // eslint-disable-next-line no-param-reassign
                            checkbox.checked = checkbox.name === `shopping_list_bulk_delete[shoppingLists][${identifier}]`;
                        }, false);

                        openModal();
                    }
                },
                false,
            );
        });
    }
})(window, window.document);
