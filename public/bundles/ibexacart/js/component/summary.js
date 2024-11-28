export default class Summary {
    constructor(options) {
        if (!options.container) {
            throw new Error('Summary: container option must be specified!');
        }

        this.container = options.container;

        this.cart = options.cart ?? window.ibexaCart;

        this.summaryNode = this.container.querySelector('.ibexa-crt-summary');
        this.summarySubtotalPriceNode = this.summaryNode.querySelector('.ibexa-crt-summary__item--subtotal');
        this.summaryTotalPriceNode = this.summaryNode.querySelector('.ibexa-crt-summary__item--total');
        this.summaryTaxItemLabelTemplate = this.summaryNode.dataset.taxItemLabelTemplate;
        this.summaryTaxItemTemplate = this.summaryNode.dataset.taxItemTemplate;
        this.netPriceTemplate = this.summaryNode.dataset.netPriceTemplate;
    }

    init() {
        this.attachSummaryListeners();
    }

    attachSummaryListeners() {
        document.body.addEventListener(
            'ibexa-cart:cart-data-changed',
            () => {
                this.refreshSummary();
            },
            false,
        );
    }

    refreshSummary() {
        this.clearSummaryData();
        this.insertSummaryData();
    }

    renderSummaryTaxItem(tax, taxValue) {
        const itemRendered = this.summaryTaxItemTemplate
            .replaceAll('{{ label }}', this.summaryTaxItemLabelTemplate.replace('{{ percentage }}', tax))
            .replaceAll('{{ value }}', taxValue);

        return itemRendered;
    }

    clearSummaryData() {
        const taxesItemsNodes = this.summaryNode.querySelectorAll('.ibexa-crt-summary__item--tax');

        taxesItemsNodes.forEach((taxItemNode) => taxItemNode.remove());
    }

    insertSummaryTaxData() {
        const summary = this.cart.getCartSummary();
        const { vatCategorySummary } = summary;

        for (const vatSummary of vatCategorySummary) {
            const {
                RestPrice: { formatted: taxValue },
                VatCategory: { vatValue: tax },
            } = vatSummary;
            const taxItemRendered = this.renderSummaryTaxItem(tax, taxValue);

            this.summaryTotalPriceNode.insertAdjacentHTML('beforebegin', taxItemRendered);
        }
    }

    insertSummaryPriceData() {
        const summary = this.cart.getCartSummary();
        const {
            TotalPrice: {
                RestPrice: { formatted: subtotalPrice },
            },
            TotalPriceInclVat: {
                RestPrice: { formatted: totalPrice },
            },
        } = summary;
        const subtotalPriceValueNode = this.summarySubtotalPriceNode.querySelector('.ibexa-crt-summary__item-value');
        const totalPriceValueNode = this.summaryTotalPriceNode.querySelector('.ibexa-crt-summary__item-value');

        subtotalPriceValueNode.innerText = this.netPriceTemplate.replace('{{ price }}', subtotalPrice);
        totalPriceValueNode.innerText = totalPrice;
    }

    insertSummaryData() {
        this.insertSummaryTaxData();
        this.insertSummaryPriceData();
    }
}
