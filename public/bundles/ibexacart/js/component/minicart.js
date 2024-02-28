export default class Minicart {
    constructor(options) {
        if (!options.container) {
            throw new Error('Minicart: container option must be specified!');
        }

        this.container = options.container;

        this.cart = options.cart ?? window.ibexaCart;
        this.counterNode = options.counter ?? this.container.querySelector('.ibexa-crt-minicart__counter');

        this.handleCartChanged = this.handleCartChanged.bind(this);
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.body.addEventListener('ibexa-cart:cart-data-changed', this.handleCartChanged, false);
    }

    handleCartChanged({ detail: { cart } }) {
        if (cart !== this.cart) {
            return;
        }

        const cartItems = this.cart.getEntries();

        this.counterNode.innerText = cartItems.length;
    }
}
