import AddToCart from '@ibexa-cart/src/bundle/Resources/public/js/component/add.to.cart';

export default class StorefrontAddToCart extends AddToCart {
    constructor(options) {
        super(options);

        this.variantSelectorNode = this.container.querySelector('.ibexa-store-add-to-cart__variant-selector');
    }

    init() {
        super.init(...arguments);

        if (this.variantSelectorNode) {
            this.variantSelectorNode.addEventListener('change', () => this.toggleVariantHighlight(false), false);
        }
    }

    toggleVariantHighlight(show) {
        this.variantSelectorNode.classList.toggle('ibexa-store-add-to-cart__variant-selector--highlight', show);
    }

    handleAddToCart() {
        if (this.variantSelectorNode) {
            const selectedVariantCode = this.variantSelectorNode.value;

            if (!selectedVariantCode) {
                this.toggleVariantHighlight(true);

                return;
            }
        }

        super.handleAddToCart(...arguments);
    }
}
