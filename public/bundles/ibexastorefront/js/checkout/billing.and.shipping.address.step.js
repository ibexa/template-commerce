import BillingAndShipping from '@ibexa-checkout/src/bundle/Resources/public/js/component/billing.and.shipping.address.js';

(function (global, doc) {
    const container = doc.querySelector('.ibexa-store-checkout__addresses-form');

    if (!container) {
        return;
    }

    const billingAndShipping = new BillingAndShipping({
        container,
    });

    billingAndShipping.init();
})(window, window.document);
