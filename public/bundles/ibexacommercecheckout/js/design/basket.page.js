(function(global, doc, ibexa) {
    const basket = new ibexa.eshop.widgets.BasketPage({
        container: doc.querySelector('.ibexa-commerce-basket-page'),
    });

    basket.init();
})(window, window.document, window.ibexa);