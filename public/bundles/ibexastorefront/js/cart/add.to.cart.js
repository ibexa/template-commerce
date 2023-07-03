import AddToCart from '@ibexa-cart/src/bundle/Resources/public/js/component/add.to.cart';

export default class StorefrontAddToCart extends AddToCart {
    constructor(options) {
        super(options);

        this.variantSelectorNode = this.container.querySelector('.ibexa-store-add-to-cart__variant-selector');
    }

    init() {
        super.init(...arguments);

        this.quantityInput.addEventListener('input', () => this.toggleQuantityInputHighlight(false), false);

        if (this.variantSelectorNode) {
            this.variantSelectorNode.addEventListener('change', () => this.toggleVariantHighlight(false), false);
        }
    }

    toggleVariantHighlight(show) {
        this.variantSelectorNode.classList.toggle('ibexa-store-add-to-cart__variant-selector--highlight', show);
    }

    toggleQuantityInputHighlight(show) {
        this.quantityInput.classList.toggle('ibexa-store-add-to-cart__quantity-input--highlight', show);
    }

    handleQuantityUpdateError(productAdded) {
        if (productAdded instanceof Promise) {
            productAdded.catch(() => {
                this.toggleQuantityInputHighlight(true);
            });
        }
    }

    handleQuantityAddedDuringCardLoading() {
        const productAdded = super.handleQuantityAddedDuringCardLoading(...arguments);

        this.handleQuantityUpdateError(productAdded);
    }

    handleAddToCart() {
        if (this.variantSelectorNode) {
            const selectedVariantCode = this.variantSelectorNode.value;

            if (!selectedVariantCode) {
                this.toggleVariantHighlight(true);

                return;
            }
        }

        const productAdded = super.handleAddToCart(...arguments);

        this.handleQuantityUpdateError(productAdded);
    }
}
