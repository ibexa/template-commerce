import BillingAndShipping from './component/billing.and.shipping.address.js';

(function (global, doc) {
    const container = doc.querySelector('.ibexa-checkout__addresses-form');

    if (!container) {
        return;
    }

    const billingAndShipping = new BillingAndShipping({
        container,
    });

    billingAndShipping.init();
})(window, window.document);
