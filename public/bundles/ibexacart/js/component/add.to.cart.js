import { forceValidQuantityInInput, guardQuantityInputValue } from '../helper/quantity.input';

export default class AddToCart {
    constructor(options) {
        if (!options.container) {
            throw new Error('AddToCart: container option must be specified!');
        }

        this.container = options.container;

        this.cart = options.cart ?? window.ibexaCart;
        this.addToCartBtn = options.addToCartBtn ?? this.container.querySelector('.ibexa-crt-add-to-cart__add-to-cart-btn');
        this.quantityInput = options.quantityInput ?? this.container.querySelector('.ibexa-crt-add-to-cart__quantity-input');

        this.addedQuantityDuringCartLoading = 0;

        this.isDuringProcessing = false;

        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.getMaxQuantity = this.getMaxQuantity.bind(this);
    }

    init() {
        this.attachEventListeners();
        this.toggleAddToCartBtnBasedOnQuantity();
    }

    attachEventListeners() {
        this.addToCartBtn?.addEventListener('click', this.handleAddToCart, false);

        guardQuantityInputValue(this.quantityInput, this.getMaxQuantity);

        this.quantityInput.addEventListener('input', () => this.toggleAddToCartBtnBasedOnQuantity(), false);
        this.quantityInput.addEventListener('change', () => this.toggleAddToCartBtnBasedOnQuantity(), false);
        this.quantityInput.addEventListener('focusout', () => this.toggleAddToCartBtnBasedOnQuantity(), false);

        document.body.addEventListener(
            'ibexa-cart:cart-data-changed',
            () => {
                this.handleQuantityAddedDuringCardLoading();
                forceValidQuantityInInput(this.quantityInput, this.getMaxQuantity);
                this.toggleAddToCartBtnBasedOnQuantity();
            },
            false,
        );
    }

    toggleAddToCartBtnBasedOnQuantity() {
        if (this.addToCartBtn && !this.isDuringProcessing) {
            this.addToCartBtn.disabled = !this.quantityInput.value.length || this.quantityInput.value === '0';
        }
    }

    toggleProcessingState(isDuringProcessing) {
        this.isDuringProcessing = isDuringProcessing;

        this.quantityInput.disabled = isDuringProcessing;
        this.addToCartBtn.disabled = isDuringProcessing;
    }

    handleQuantityAddedDuringCardLoading() {
        if (this.addedQuantityDuringCartLoading) {
            const productCode = this.getProductCode();

            const productAdded = this.cart.addProduct(productCode, this.addedQuantityDuringCartLoading);

            this.addedQuantityDuringCartLoading = 0;
            this.resetQuantity();
            this.toggleProcessingState(false);

            return productAdded;
        }
    }

    getProductCode() {
        const { productCode } = this.container.dataset;

        return productCode;
    }

    getQuantity() {
        const quantityInputValue = this.quantityInput.value;

        return parseInt(quantityInputValue, 10);
    }

    getMaxQuantity() {
        return Number.MAX_SAFE_INTEGER;
    }

    resetQuantity() {
        const maxQuantity = this.getMaxQuantity();

        this.quantityInput.value = maxQuantity === 0 ? 0 : 1;
    }

    handleAddToCart() {
        const productCode = this.getProductCode();
        const quantity = this.getQuantity();

        if (!productCode) {
            return;
        }

        this.toggleProcessingState(true);

        const isCartLoaded = this.cart.isCartLoaded();

        if (isCartLoaded) {
            return this.cart.addProduct(productCode, quantity).finally(() => {
                this.resetQuantity();
                this.toggleProcessingState(false);
            });
        }

        this.addedQuantityDuringCartLoading += quantity;

        return this.addedQuantityDuringCartLoading;
    }
}
