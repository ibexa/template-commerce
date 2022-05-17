(function(global, doc, ibexa, ibexa) {
    const accordion = new ibexa.eshop.widgets.Accordion();
    const updateQuantity = (event) => {
        const { currentTarget } = event;
        const { relatedInputSelector } = currentTarget.dataset;
        const hiddenInputNode = doc.querySelector(relatedInputSelector);

        hiddenInputNode.value = currentTarget.value;
    };

    doc.querySelectorAll('.ibexa-commerce-wishlist__line-quantity-input').forEach((input) => {
        input.addEventListener('change', updateQuantity, false);
    });

    accordion.init('.ibexa-commerce-accordion--wishlist');
})(window, window.document, window.ibexa, window.ibexa);
