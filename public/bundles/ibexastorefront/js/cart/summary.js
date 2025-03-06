import Summary from '@ibexa-cart/src/bundle/Resources/public/js/component/summary';

export default class StorefrontSummary extends Summary {
    constructor(options) {
        super(options);

        this.summaryDiscountNode = this.summaryNode.querySelector('.ibexa-store-maincart-summary__item--discount');
    }

    insertSummaryDiscountData() {
        if (!this.summaryDiscountNode) {
            return;
        }

        const summary = this.cart.getCartSummary();
        const discountPriceFormatted = summary.TotalDiscount?.RestPrice.formatted ?? null;
        const totalDiscount = discountPriceFormatted ? `-${discountPriceFormatted}` : '0';
        const discountValueNode = this.summaryDiscountNode.querySelector('.ibexa-crt-summary__item-value');

        discountValueNode.innerText = totalDiscount;
    }

    insertSummaryData() {
        super.insertSummaryData(...arguments);

        this.insertSummaryDiscountData();
    }
}
