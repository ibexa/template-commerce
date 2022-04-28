import getFormDataFromObject from './helpers/form.data.helper.js';

(function(global, doc, ibexa) {
    const skuWrapper = doc.querySelector('.ibexa-sku-search--stock');

    if (!skuWrapper) {
        return;
    }

    const searchInput = skuWrapper.querySelector('.ibexa-sku-search__input');
    const searchButton = skuWrapper.querySelector('.ibexa-btn--search');
    const searchResults = skuWrapper.querySelector('.ibexa-sku-search__results');
    const saveButton = skuWrapper.querySelector('.ibexa-btn--save');
    const skuUpdateWrapper = skuWrapper.querySelector('.ibexa-stock-management');
    const enterKeyCode = 13;
    let skuData = {};
    const handleKeyUp = (event) => {
        const keyCode = event.charCode || event.keyCode || 0;

        if (keyCode === enterKeyCode) {
            search();
        }
    };
    const search = (skuCode) => {
        const sku = skuCode || searchInput.value;
        const request = new Request(Routing.generate('ibexa.commerce.menu.admin.fetch_stock', { shopId: 'MAIN' }), {
            method: 'POST',
            body: getFormDataFromObject({ sku }),
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then(handleSearchResponse)
            .catch(ibexa.helpers.notification.showErrorNotification);
    };
    const handleSearchResponse = (response) => {
        if (response.result && response.result.message !== undefined) {
            const notFoundMessage = Translator.trans(/*@Desc("Product not found")*/ 'product.not_found', {}, 'price_stock_ui');

            ibexa.helpers.notification.showWarningNotification(notFoundMessage);

            if (searchResults) {
                searchResults.classList.add('ibexa-sku-search__results--hidden');
            }

            return;
        }

        skuData = response;

        skuUpdateWrapper.innerHTML = '';

        Object.entries(skuData.stock).forEach(renderSkuUpdate);
    };
    const renderSkuUpdate = ([variantSku, stockData]) => {
        const skuUpdateFragment = doc.createDocumentFragment();
        const skuUpdateContainer = doc.createElement('div');
        const template = skuUpdateWrapper.dataset.template;
        const renderedTemplate = template.replace('{{ sku }}', variantSku).replace('{{ variant_sku }}', variantSku);

        skuUpdateContainer.insertAdjacentHTML('beforeend', renderedTemplate);

        const stockUpdateWrapper = skuUpdateContainer.querySelector('.ibexa-stock-update');
        const onStockInput = stockUpdateWrapper.querySelector('.ibexa-stock-update__input--on-stock');
        const stockTextInput = stockUpdateWrapper.querySelector('.ibexa-stock-update__input--stock-text');

        onStockInput.value = stockData ? stockData.stock : '';
        stockTextInput.value = stockData ? stockData.stockSign : '';

        skuUpdateFragment.append(stockUpdateWrapper);
        skuUpdateWrapper.append(skuUpdateFragment);

        saveButton.classList.remove('ibexa-btn--hidden');

        if (searchResults) {
            searchResults.classList.remove('ibexa-sku-search__results--hidden');
        }
    };
    const save = () => {
        const stockUpdateNodes = skuUpdateWrapper.querySelectorAll('.ibexa-stock-update');

        stockUpdateNodes.forEach((stockUpdateNode) => {
            const variantSku = stockUpdateNode.dataset.sku;
            const onStockInput = stockUpdateNode.querySelector('.ibexa-stock-update__input--on-stock');
            const stockTextInput = stockUpdateNode.querySelector('.ibexa-stock-update__input--stock-text');

            skuData.stock[variantSku].stock = onStockInput.value;
            skuData.stock[variantSku].stockSign = stockTextInput.value;
        });

        const request = new Request(Routing.generate('ibexa.commerce.menu.admin.update_stock'), {
            method: 'POST',
            body: getFormDataFromObject({ stock: skuData }),
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then((response) => {
                if (response.message !== undefined) {
                    const notSavedMessage = Translator.trans(/*@Desc("Couldn't save stock")*/ 'stock.not_saved', {}, 'price_stock_ui');

                    ibexa.helpers.notification.showErrorNotification(notSavedMessage);
                } else {
                    const savedMessage = Translator.trans(/*@Desc("Stock saved successfully")*/ 'stock.saved', {}, 'price_stock_ui');

                    ibexa.helpers.notification.showSuccessNotification(savedMessage);
                }
            })
            .catch(ibexa.helpers.notification.showErrorNotification);
    };

    if (searchInput) {
        searchInput.addEventListener('keyup', handleKeyUp, false);
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => search(), false);
    }

    if (skuWrapper.dataset.sku) {
        search(skuWrapper.dataset.sku);
    }

    saveButton.addEventListener('click', save, false);
})(window, window.document, window.ibexa);
