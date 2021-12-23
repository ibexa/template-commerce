import getFormDataFromObject from './helpers/form.data.helper.js';

(function(global, doc, ibexa) {
    const addButton = doc.querySelector('.ibexa-btn--add-shipping');
    const saveButton = doc.querySelector('.ibexa-btn--save');
    const table = doc.querySelector('.ibexa-table--shipping-management');
    let shippingCostsList = [];
    let shippingMethods = [];
    let newRowNumber = 0;
    const fetchShippingCosts = () => {
        const url = Routing.generate('siso_menu_admin_fetch_shipping_costs');

        fetch(url, { mode: 'same-origin', credentials: 'same-origin' })
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then(renderShippingCosts)
            .catch(ibexa.helpers.notification.showErrorNotification);
    };
    const renderShippingCosts = (response) => {
        shippingCostsList = response.shippingCostsList;
        shippingMethods = response.shippingMethods;

        shippingCostsList.forEach(addRow);
    };
    const renderShippingMethodsOptions = (shippingMethodsDropdown) => {
        const sourceInput = shippingMethodsDropdown.querySelector('.ibexa-dropdown__source .ibexa-input');
        const itemsList = shippingMethodsDropdown.querySelector('.ibexa-dropdown__items-list');
        const { optionTemplate } = sourceInput.dataset;
        const { template: itemTemplate } = itemsList.dataset;

        const selectOptionsFragment = doc.createDocumentFragment();
        const itemsListFragment = doc.createDocumentFragment();

        shippingMethods.forEach((shippingMethod) => {
            const optionsContainer = doc.createElement('select');
            const itemsContainer = doc.createElement('ul');

            const optionRendered = optionTemplate
                .replace('{{ value }}', shippingMethod.value)
                .replace('{{ label }}', shippingMethod.label)
                .replace('{{ name }}', shippingMethod.id || `shipping-method-${newRowNumber}`);
            const itemRendered = itemTemplate.replace('{{ value }}', shippingMethod.value).replaceAll('{{ label }}', shippingMethod.label);

            optionsContainer.insertAdjacentHTML('beforeend', optionRendered);
            itemsContainer.insertAdjacentHTML('beforeend', itemRendered);

            selectOptionsFragment.append(optionsContainer.querySelector('option'));
            itemsListFragment.append(itemsContainer.querySelector('li'));
        });

        sourceInput.append(selectOptionsFragment);
        itemsList.append(itemsListFragment);
    };
    const addRow = (shippingCosts) => {
        const container = doc.createElement('tbody');
        const template = table.dataset.rowTemplate.replaceAll(
            '{{ name }}',
            shippingCosts ? shippingCosts.id : `shipping-costs-${newRowNumber}`,
        );

        container.insertAdjacentHTML('beforeend', template);

        const row = container.querySelector('tr');
        const stateInput = row.querySelector('.ibexa-table__state-input');
        const zipInput = row.querySelector('.ibexa-table__zip-input');
        const shippingCostInput = row.querySelector('.ibexa-table__shipping-cost');
        const valueInput = row.querySelector('.ibexa-table__value');
        const currencyInput = row.querySelector('.ibexa-table__currency');
        const countryDropdownNode = row.querySelector('.ibexa-dropdown--country');
        const shippingMethodsDropdownNode = row.querySelector('.ibexa-dropdown--shipping-method');

        renderShippingMethodsOptions(shippingMethodsDropdownNode);

        const countryDropdown = new ibexa.core.Dropdown({
            container: countryDropdownNode,
        });
        const shippingMethodDropdown = new ibexa.core.Dropdown({
            container: shippingMethodsDropdownNode,
        });

        countryDropdown.init();
        shippingMethodDropdown.init();

        if (shippingCosts) {
            countryDropdown.selectOption(shippingCosts.country.value);
            shippingMethodDropdown.selectOption(shippingCosts.shippingMethod.value);
        }

        stateInput.value = shippingCosts ? shippingCosts.state : '';
        zipInput.value = shippingCosts ? shippingCosts.zip : '';
        shippingCostInput.value = shippingCosts ? shippingCosts.shippingCost : 0;
        valueInput.value = shippingCosts ? shippingCosts.valueOfGoods : 0;
        currencyInput.value = shippingCosts ? shippingCosts.currency : '';

        row.querySelector('.ibexa-btn--remove-row').addEventListener(
            'click',
            (event) => {
                event.currentTarget.closest('tr').remove();
            },
            false,
        );

        table.querySelector('tbody').append(row);
        doc.body.dispatchEvent(new CustomEvent('ibexa-inputs:added'));

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
            const countryLabel = countrySelect.querySelector(`[value=${countryValue}]`).innerText;
            const shippingMethodValue = shippingMethodsSelect.value;
            const shippingMethodLabel = shippingMethods.find((shippingMethod) => shippingMethodValue === shippingMethod.value).label;

            return {
                country: {
                    value: countryValue,
                    label: countryLabel.trim(),
                },
                state: stateInput.value,
                zip: zipInput.value,
                shippingMethod: {
                    value: shippingMethodValue,
                    label: shippingMethodLabel.trim(),
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
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then((response) => {
                if (!response.success) {
                    const notSavedMessage = Translator.trans(
                        /*@Desc("Couldn't save shipping costs")*/ 'shipping_management.not_saved',
                        {},
                        'price_stock_ui',
                    );

                    ibexa.helpers.notification.showErrorNotification(notSavedMessage);
                } else {
                    const savedMessage = Translator.trans(
                        /*@Desc("Shipping costs saved successfully")*/ 'shipping_management.saved',
                        {},
                        'price_stock_ui',
                    );

                    ibexa.helpers.notification.showSuccessNotification(savedMessage);
                }
            })
            .catch(ibexa.helpers.notification.showErrorNotification);
    };

    fetchShippingCosts();

    addButton.addEventListener('click', () => addRow(), false);
    saveButton.addEventListener('click', save, false);
})(window, window.document, window.ibexa);
