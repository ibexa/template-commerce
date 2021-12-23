(function(global, doc, ibexa) {
    const DEFAULT_SHOP_ID = 'MAIN';
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const filtersEndpoint = {
        currencies: {
            url: '/api/ezp/v2/rest/currency-list',
            accept: 'application/vnd.ez.api.CurrencyList+json',
            contentType: 'application/vnd.ez.api.CurrencyList+json',
        },
        shops: {
            url: '/api/ezp/v2/rest/shop-list',
            accept: 'application/vnd.ez.api.ShopList+json',
            contentType: 'application/vnd.ez.api.ShopList+json',
        },
    };
    const shopSelect = doc.querySelector('select[name="shop_id"]');
    const currencySelect = doc.querySelector('select[name="currency"]');
    const shopDropdownContainer = doc.querySelector('.ibexa-dropdown--shop');
    const currencyDropdownContainer = doc.querySelector('.ibexa-dropdown--currency');
    const updateSummaryItemValue = (itemNode, value) => {
        const valueNode = itemNode.querySelector('.ibexa-commerce-dashboard-summary-item__value');

        valueNode.innerHTML = value;
    };
    const updateSalesSummary = (data) => {
        const summaryItem = doc.querySelector('.ibexa-commerce-dashboard-summary-item--sales');

        updateSummaryItemValue(summaryItem, data.sales);
    };
    const updateAverageOrderSummary = (data) => {
        const summaryItem = doc.querySelector('.ibexa-commerce-dashboard-summary-item--average-order');

        updateSummaryItemValue(summaryItem, data.averageOrder);
    };
    const updateNumberOfCustomersSummary = (data) => {
        const summaryItem = doc.querySelector('.ibexa-commerce-dashboard-summary-item--number-of-customers');

        updateSummaryItemValue(summaryItem, data.totalCustomers);
    };
    const updateNumberOfProductsSummary = (data) => {
        const summaryItem = doc.querySelector('.ibexa-commerce-dashboard-summary-item--number-of-products');

        updateSummaryItemValue(summaryItem, data.totalProducts);
    };
    const updateSummaryItems = () => {
        if (!shopSelect.value || !currencySelect.value) {
            return;
        }

        const request = new Request(`/api/ezp/v2/rest/dashboard-summary/${shopSelect.value}/${currencySelect.value}`, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.ez.api.dashboardData+json',
                'Content-Type': 'application/vnd.ez.api.dashboardData+json',
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then((response) => {
                const { dashboardData } = response.data;

                updateSalesSummary(dashboardData);
                updateAverageOrderSummary(dashboardData);
                updateNumberOfCustomersSummary(dashboardData);
                updateNumberOfProductsSummary(dashboardData);
            })
            .catch(ibexa.helpers.notification.showErrorNotification);
    };
    const getDropdownData = (filter, dashboardDropdownRequestCallback) => {
        const endpoint = filtersEndpoint[filter];
        const request = new Request(endpoint.url, {
            method: 'GET',
            headers: {
                Accept: endpoint.accept,
                'Content-Type': endpoint.contentType,
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then(dashboardDropdownRequestCallback)
            .catch(ibexa.helpers.notification.showErrorNotification);
    };
    const prepareShopsFilterCallback = (response) => {
        const shopList = Object.values(response.ShopList.shopList).length
            ? Object.values(response.ShopList.shopList).map(({ shop }) => shop)
            : [DEFAULT_SHOP_ID];
        const sourceShopSelect = shopDropdownContainer.querySelector('.ibexa-input--select');

        shopList.forEach((shop, index) => {
            const option = doc.createRange().createContextualFragment(`
                <option value="${shop}" ${index === 0 && 'selected'}>${shop}</option>
            `);

            sourceShopSelect.append(option);
        });

        initDropdown(shopDropdownContainer);
    };
    const prepareCurrenciesFilterCallback = (response) => {
        const currencyList = Object.keys(response.CurrencyList.currencyList);
        const sourceCurrencySelect = currencyDropdownContainer.querySelector('.ibexa-input--select');

        currencyList.forEach((currency, index) => {
            const option = doc.createRange().createContextualFragment(`
                <option value="${currency}" ${index === 1 && 'selected'}>${currency}</option>
            `);

            sourceCurrencySelect.append(option);
        });

        initDropdown(currencyDropdownContainer);
    };
    const prepareShopFilter = () => {
        getDropdownData('shops', prepareShopsFilterCallback);
    };
    const prepareCurrenciesFilter = () => {
        getDropdownData('currencies', prepareCurrenciesFilterCallback);
    };
    const initDropdown = (container) => {
        const itemsList = container.querySelector('.ibexa-dropdown__items-list');
        const sourceSelect = container.querySelector('.ibexa-dropdown__source .ibexa-input--select');
        const options = sourceSelect.querySelectorAll('option');
        const selectionInfoNode = container.querySelector('.ibexa-dropdown__selection-info');
        const { template: selectedItemTemplate } = selectionInfoNode.dataset;
        const { itemTemplate } = container.dataset;
        const dropdown = new ibexa.core.Dropdown({ container });

        options.forEach((option) => {
            const dropdownItemHTML = itemTemplate
                .replace('{{ item_value }}', option.value)
                .replace('{{ item_checked }}', option.selected && 'checked')
                .replace('{{ item_selected }}', option.selected && 'ibexa-dropdown__item--selected')
                .replaceAll('{{ item_label }}', option.innerHTML);

            itemsList.insertAdjacentHTML('beforeend', dropdownItemHTML);

            if (option.selected) {
                const selectedItemHTML = selectedItemTemplate.replace('{{ value }}', option.value).replace('{{ label }}', option.innerHTML);

                selectionInfoNode.insertAdjacentHTML('beforeend', selectedItemHTML);
            }
        });

        sourceSelect.dispatchEvent(new Event('change'));
        dropdown.init();
    };

    prepareShopFilter();
    prepareCurrenciesFilter();
    updateSummaryItems();
    shopSelect.addEventListener('change', updateSummaryItems, false);
    currencySelect.addEventListener('change', updateSummaryItems, false);
})(window, window.document, window.ibexa);
