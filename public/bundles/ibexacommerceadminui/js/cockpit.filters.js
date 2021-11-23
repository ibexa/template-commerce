(function(global, doc, eZ) {
    const DEFAULT_SHOP_ID = 'MAIN';
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const shopSelect = doc.querySelector('select[name="shop_id"]');
    const currencySelect = doc.querySelector('select[name="currency"]');
    const shopDropdownContainer = doc.querySelector('.ibexa-dropdown--shop');
    const currencyDropdownContainer = doc.querySelector('.ibexa-dropdown--currency');
    const showShopIds = () => {
        const request = new Request('/api/ezp/v2/rest/shop-list', {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.ez.api.ShopList+json',
                'Content-Type': 'application/vnd.ez.api.ShopList+json',
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(eZ.helpers.request.getJsonFromResponse)
            .then((response) => {
                const shopList = Object.values(response.ShopList.shopList).length
                    ? Object.values(response.ShopList.shopList).map(({ shop }) => shop)
                    : [DEFAULT_SHOP_ID];
                const dropdownItemTemplate = shopDropdownContainer.dataset.itemTemplate;
                const selectedDropdownItemTemplate = shopDropdownContainer.dataset.selectedItemTemplate;

                shopList.forEach((shopId, index) => {
                    const option = doc.createRange().createContextualFragment(`
                        <option value="${shopId}">${shopId}</option>
                    `);
                    const dropdownItem = dropdownItemTemplate
                        .replace('{{ item_value }}', shopId)
                        .replace('{{ item_selected }}', index === 0 ? 'ibexa-dropdown__item--selected' : '')
                        .replace('{{ item_checked }}', index === 0 ? 'checked' : '')
                        .replaceAll('{{ item_label }}', shopId);
                    const selectedItem = selectedDropdownItemTemplate
                        .replace('{{ item_value }}', shopId)
                        .replace('{{ item_label }}', shopId);

                    if (index === 0) {
                        shopDropdownContainer
                            .querySelector('.ibexa-dropdown__selection-info')
                            .insertAdjacentHTML('beforeend', selectedItem);
                    }

                    shopDropdownContainer.querySelector('.ibexa-dropdown__items-list').insertAdjacentHTML('beforeend', dropdownItem);
                    shopSelect.append(option);
                });

                initDropdown(shopDropdownContainer);
                shopSelect.value = shopList[0];
                shopSelect.dispatchEvent(new Event('change'));
            })
            .catch(eZ.helpers.notification.showErrorNotification);
    };
    const showCurrencies = () => {
        const request = new Request('/api/ezp/v2/rest/currency-list', {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.ez.api.CurrencyList+json',
                'Content-Type': 'application/vnd.ez.api.CurrencyList+json',
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(eZ.helpers.request.getJsonFromResponse)
            .then((response) => {
                const currencyList = Object.keys(response.CurrencyList.currencyList);
                const dropdownItemTemplate = currencyDropdownContainer.dataset.itemTemplate;
                const selectedDropdownItemTemplate = currencyDropdownContainer.dataset.selectedItemTemplate;

                currencyList.forEach((currency, index) => {
                    const option = doc.createRange().createContextualFragment(`
                        <option value="${currency}">${currency}</option>
                    `);
                    const dropdownItem = dropdownItemTemplate
                        .replace('{{ item_value }}', currency)
                        .replace('{{ item_selected }}', index === 0 ? 'ibexa-dropdown__item--selected' : '')
                        .replace('{{ item_checked }}', index === 0 ? 'checked' : '')
                        .replaceAll('{{ item_label }}', currency);
                    const selectedItem = selectedDropdownItemTemplate
                        .replace('{{ item_value }}', currency)
                        .replace('{{ item_label }}', currency);

                    if (index === 0) {
                        currencyDropdownContainer
                            .querySelector('.ibexa-dropdown__selection-info')
                            .insertAdjacentHTML('beforeend', selectedItem);
                    }

                    currencyDropdownContainer.querySelector('.ibexa-dropdown__items-list').insertAdjacentHTML('beforeend', dropdownItem);
                    currencySelect.append(option);
                });

                initDropdown(currencyDropdownContainer);
                currencySelect.value = currencyList[0];
                currencySelect.dispatchEvent(new Event('change'));
            })
            .catch(eZ.helpers.notification.showErrorNotification);
    };
    const initDropdown = (container) => {
        const dropdown = new eZ.core.Dropdown({ container });

        dropdown.init();
    };

    showShopIds();
    showCurrencies();
})(window, window.document, window.eZ);
