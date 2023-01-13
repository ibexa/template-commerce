export default class AddToCart {
    constructor(options) {
        if (!options.container) {
            throw new Error('AddToCart: container option must be specified!');
        }

        this.container = options.container;

        this.cart = options.cart ?? window.ibexaCart;
        this.addToCartBtn = options.addToCartBtn ?? this.container.querySelector('.ibexa-crt-add-to-cart__add-to-cart-btn');
        this.quantityInput = options.quantityInput ?? this.container.querySelector('.ibexa-crt-add-to-cart__quantity-input');

        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.addToCartBtn?.addEventListener('click', this.handleAddToCart);
    }

    getProductCode() {
        const { productCode } = this.container.dataset;

        return productCode;
    }

    getQuantity() {
        const quantityInputValue = this.quantityInput.value;

        return parseInt(quantityInputValue, 10);
    }

    handleAddToCart() {
        const productCode = this.getProductCode();
        const quantity = this.getQuantity();

        if (productCode) {
            return this.cart.addProduct(productCode, quantity);
        }
    }
}
