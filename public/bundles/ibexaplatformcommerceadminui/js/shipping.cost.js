import getFormDataFromObject from './helpers/form.data.helper.js';

(function(global, doc, eZ) {
    const addButton = doc.querySelector('.ez-shipping-management .ibexa-btn--add-shipping');
    const saveButton = doc.querySelector('.ez-shipping-management .ibexa-btn--save');
    const table = doc.querySelector('.ibexa-table--shipping-management');
    let shippingCostsList = [];
    let shippingMethods = [];
    let newRowNumber = 0;
    const fetchShippingCosts = () => {
        const url = Routing.generate('siso_menu_admin_fetch_shipping_costs');

        fetch(url, { mode: 'same-origin', credentials: 'same-origin' })
            .then(eZ.helpers.request.getJsonFromResponse)
            .then(renderShippingCosts)
            .catch(eZ.helpers.notification.showErrorNotification);
    };
    const renderShippingCosts = (response) => {
        shippingCostsList = response.shippingCostsList;
        shippingMethods = response.shippingMethods;

        shippingCostsList.forEach(addRow);
    };
    const selectCustomDropdownItem = (value, container) => {
        container.querySelector(`.ibexa-dropdown__item[data-value="${value}"]`).classList.add('ibexa-dropdown__item--selected');
        container.querySelector('.ibexa-dropdown__item--selected input').checked = true;
    };
    const addRow = (shippingCosts) => {
        const container = doc.createElement('tbody');
        const template = table.dataset.rowTemplate.replaceAll(
            '{{ name }}',
            shippingCosts ? shippingCosts.id : `shipping-costs-${newRowNumber}`
        );

        container.insertAdjacentHTML('beforeend', template);

        const row = container.querySelector('tr');
        const countrySelect = row.querySelector('.ibexa-table__country-select');
        const stateInput = row.querySelector('.ibexa-table__state-input');
        const zipInput = row.querySelector('.ibexa-table__zip-input');
        const shippingMethodsSelect = row.querySelector('.ibexa-table__shipping-method');
        const shippingCostInput = row.querySelector('.ibexa-table__shipping-cost');
        const valueInput = row.querySelector('.ibexa-table__value');
        const currencyInput = row.querySelector('.ibexa-table__currency');
        const shippingMethodsFragment = doc.createDocumentFragment();
        const countrySelectedDropdown = countrySelect.closest('.ibexa-dropdown');
        const shippingMethodsDropdown = shippingMethodsSelect.closest('.ibexa-dropdown');

        shippingMethods.forEach((shippingMethod) => {
            const container = doc.createElement('select');
            const option = `<option value="${shippingMethod.value}">${shippingMethod.label}</option>`;
            const dropdownItemsContainer = shippingMethodsDropdown.querySelector('.ibexa-dropdown__items');
            const dropdownItem = shippingMethodsDropdown.dataset.itemTemplate
                .replace('{{ item_value }}', shippingMethod.value)
                .replace('{{ item_label }}', shippingMethod.label)
                .replace('{{ name }}', shippingMethod.id || `shipping-method-${newRowNumber}`);

            container.insertAdjacentHTML('beforeend', option);
            shippingMethodsFragment.append(container.querySelector('option'));
            dropdownItemsContainer.insertAdjacentHTML('beforeend', dropdownItem);
        });

        shippingMethodsSelect.append(shippingMethodsFragment);
        row.querySelectorAll('.ibexa-dropdown').forEach((node) => {
            const dropdown = new eZ.core.Dropdown({
                container: node,
                itemsContainer: node.querySelector('.ibexa-dropdown__items'),
                sourceInput: node.querySelector('.ibexa-dropdown__source-input'),
            });

            dropdown.init();
        });

        if (shippingCosts) {
            const selectedItemContainer = countrySelectedDropdown.querySelector('.ibexa-dropdown__selection-info');
            const selectedItem = countrySelectedDropdown.dataset.selectedItemTemplate
                .replace('{{ item_value }}', shippingCosts.country.value)
                .replace('{{ item_label }}', shippingCosts.country.value);

            countrySelect.value = shippingCosts.country.value;
            selectedItemContainer.insertAdjacentHTML('beforeend', selectedItem);
            selectCustomDropdownItem(shippingCosts.country.value, countrySelectedDropdown);
        }

        stateInput.value = shippingCosts ? shippingCosts.state : '';
        zipInput.value = shippingCosts ? shippingCosts.zip : '';

        if (shippingCosts) {
            const selectedItemContainer = shippingMethodsDropdown.querySelector('.ibexa-dropdown__selection-info');
            const selectedItem = shippingMethodsDropdown.dataset.selectedItemTemplate
                .replace('{{ item_value }}', shippingCosts.shippingMethod.label)
                .replace('{{ item_label }}', shippingCosts.shippingMethod.value);

            shippingMethodsSelect.value = shippingCosts.shippingMethod.value;
            selectedItemContainer.insertAdjacentHTML('beforeend', selectedItem);
            selectCustomDropdownItem(shippingCosts.shippingMethod.value, shippingMethodsDropdown);
        }

        shippingCostInput.value = shippingCosts ? shippingCosts.shippingCost : 0;
        valueInput.value = shippingCosts ? shippingCosts.valueOfGoods : 0;
        currencyInput.value = shippingCosts ? shippingCosts.currency : '';

        row.querySelector('.btn').addEventListener(
            'click',
            (event) => {
                event.currentTarget.closest('tr').remove();
            },
            false
        );

        table.querySelector('tbody').append(row);
        newRowNumber++;
    };
    const save = () => {
        const tableRows = [...table.querySelectorAll('tbody tr')];
        const shippingCostsList = tableRows.map((tableRow) => {
            const countrySelect = tableRow.querySelector('.ibexa-table__country-select');
            const stateInput = tableRow.querySelector('.ibexa-table__state-input');
            const zipInput = tableRow.querySelector('.ibexa-table__zip-input');
            const shippingMethodsSelect = tableRow.querySelector('.ibexa-table__shipping-method');
            const shippingCostInput = tableRow.querySelector('.ibexa-table__shipping-cost');
            const valueInput = tableRow.querySelector('.ibexa-table__value');
            const currencyInput = tableRow.querySelector('.ibexa-table__currency');
            const countryValue = countrySelect.value;
            const countryLabel = countrySelect.querySelector(`[value=${countryValue}]`).innerHTML;
            const shippingMethodValue = shippingMethodsSelect.value;
            const shippingMethodLabel = shippingMethods.find((shippingMethod) => shippingMethodValue === shippingMethod.value).label;

            return {
                country: {
                    value: countryValue,
                    label: countryLabel,
                },
                state: stateInput.value,
                zip: zipInput.value,
                shippingMethod: {
                    value: shippingMethodValue,
                    label: shippingMethodLabel,
                },
                shippingCost: shippingCostInput.value,
                valueOfGoods: valueInput.value,
                currency: currencyInput.value,
                shopId: {
                    value: 'MAIN',
                    label: 'MAIN',
                },
            };
        });

        const request = new Request(Routing.generate('siso_menu_admin_update_shipping_costs'), {
            method: 'POST',
            body: getFormDataFromObject({ shippingCostsList }),
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(eZ.helpers.request.getJsonFromResponse)
            .then((response) => {
                if (!response.success) {
                    const notSavedMessage = Translator.trans(
                        /*@Desc("Couldn't save shipping costs")*/ 'shipping_management.not_saved',
                        {},
                        'price_stock_ui'
                    );

                    eZ.helpers.notification.showErrorNotification(notSavedMessage);
                } else {
                    const savedMessage = Translator.trans(
                        /*@Desc("Shipping costs saved successfully")*/ 'shipping_management.saved',
                        {},
                        'price_stock_ui'
                    );

                    eZ.helpers.notification.showSuccessNotification(savedMessage);
                }
            })
            .catch(eZ.helpers.notification.showErrorNotification);
    };

    fetchShippingCosts();

    addButton.addEventListener('click', () => addRow(), false);
    saveButton.addEventListener('click', save, false);
})(window, window.document, window.eZ);
