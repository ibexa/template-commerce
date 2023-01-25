import * as cartService from '../service/cart';
import deepClone from '../helper/deep.clone.helper';

export default class Cart {
    constructor(options = {}) {
        if (window.ibexaCart) {
            throw new Error('Cart: there was already created instance for cart; currently there is no support for multiple carts');
        }

        window.ibexaCart = this;

        this.userId = options.userId ?? parseInt(document.querySelector('meta[name="UserId"]').content, 10);
        this.currencyCode = options.currencyCode ?? document.querySelector('meta[name="ActiveCurrencyCode"]').content;

        this.lang = options.lang ?? document.documentElement.lang;

        this.cartData = null;
        this.cartSummary = null;
        this.loadCart();
    }

    createCart() {
        cartService.createCart(this.currencyCode).then((response) => {
            cartService.loadCartSummary(response.Cart.identifier).then((summaryResponse) => {
                this.cartData = response.Cart;
                this.cartSummary = summaryResponse.CartSummary;
                this.onCartDataChanged();
            });
        });
    }

    loadCart() {
        cartService.loadUserCarts(this.userId).then((response) => {
            const result = response.CartView.Result;

            if (result.count === 0) {
                this.createCart();

                return;
            }

            const firstCart = result.CartList.Cart[0];

            cartService.loadCartSummary(firstCart.identifier).then((summaryResponse) => {
                this.cartData = result.CartList.Cart[0];
                this.cartSummary = summaryResponse.CartSummary;
                this.onCartDataChanged();
            });
        });
    }

    onCartDataChanged() {
        document.body.dispatchEvent(
            new CustomEvent('ibexa-cart:cart-data-changed', {
                detail: { cart: this },
            }),
        );
    }

    getId() {
        return this.cartData.id;
    }

    getIdentifier() {
        return this.cartData.identifier;
    }

    getCartData() {
        return deepClone(this.cartData);
    }

    getCartSummary() {
        return deepClone(this.cartSummary);
    }

    getEntries() {
        return deepClone(this.cartData.entries);
    }

    getEntryByIdentifier(identifier) {
        if (!this.cartData) {
            throw new Error(`Cart:getEntryByIdentifier: no cart data loaded!`);
        }

        const entry = this.cartData.entries.find((cartEntry) => cartEntry.identifier === identifier);

        return deepClone(entry);
    }

    getEntrySummaryByIdentifier(identifier) {
        if (!this.cartSummary) {
            throw new Error(`Cart:getEntrySummaryByIdentifier: no cart summary data loaded!`);
        }

        const entry = this.cartSummary.SummaryEntryCollection.SummaryEntry.find((entrySummary) => entrySummary.identifier === identifier);

        return deepClone(entry);
    }

    getEntryViolationByIdentifier(identifier) {
        if (!this.cartSummary) {
            throw new Error(`Cart:getEntryViolationByIdentifier: no cart data loaded!`);
        }

        const entryViolations = this.cartSummary.CartConstraintViolationList.violations.filter(
            (violation) => violation.propertyPath === `entries[${identifier}]`,
        );

        return deepClone(entryViolations);
    }

    getEntryProductName(identifier) {
        if (!this.cartData) {
            throw new Error(`Cart:getEntryProductName: no cart data loaded!`);
        }

        const entrySummary = this.getEntrySummaryByIdentifier(identifier);
        let productName = entrySummary?.Product?.name;

        if (productName) {
            return productName;
        }

        const entry = this.getEntryByIdentifier(identifier);
        const productNameValue = entry.names.value.find((nameValue) => nameValue._languageCode === this.lang) ?? entry.names.value[0];

        productName = productNameValue['#text'];

        return productName;
    }

    getProductEntry(productCode) {
        const productEntry = this.cartData.entries.find(
            (entry) => entry.product._href === `/api/ibexa/v2/product/catalog/products/${productCode}`,
        );

        return productEntry;
    }

    getLocale() {
        return this.locale;
    }

    addProduct(productCode, quantity) {
        const productEntry = this.getProductEntry(productCode);
        const isProductInCart = !!productEntry;

        if (isProductInCart) {
            return this.updateEntryQuantity(productEntry.identifier, productEntry.quantity + quantity);
        }

        return cartService.createCartEntry(this.getIdentifier(), productCode, quantity).then((response) => {
            return cartService.loadCartSummary(response.Cart.identifier).then((summaryResponse) => {
                this.cartData = response.Cart;
                this.cartSummary = summaryResponse.CartSummary;
                this.onCartDataChanged();

                return this.getCartData();
            });
        });
    }

    updateEntryQuantity(entryIdentifier, newQuantity) {
        const entry = this.getEntryByIdentifier(entryIdentifier);

        if (!entry) {
            throw new Error(`Cart:updateItemQuantity: no entry with with identifier ${entryIdentifier} in the cart!`);
        }

        return cartService.updateProductQuantity(this.getIdentifier(), entryIdentifier, newQuantity).then((response) => {
            return cartService.loadCartSummary(response.Cart.identifier).then((summaryResponse) => {
                this.cartData = response.Cart;
                this.cartSummary = summaryResponse.CartSummary;
                this.onCartDataChanged();

                return this.getCartData();
            });
        });
    }

    removeEntry(entryIdentifier) {
        const entry = this.getEntryByIdentifier(entryIdentifier);

        if (!entry) {
            throw new Error(`Cart:removeItem: not entry with identifier ${entryIdentifier} in the cart!`);
        }

        return cartService.deleteCartEntry(this.getIdentifier(), entryIdentifier).then((response) => {
            return cartService.loadCartSummary(response.Cart.identifier).then((summaryResponse) => {
                this.cartData = response.Cart;
                this.cartSummary = summaryResponse.CartSummary;
                this.onCartDataChanged();

                return this.getCartData();
            });
        });
    }

    empty() {
        return cartService.emptyCart(this.getIdentifier()).then(() => {
            this.loadCart();
        });
    }
}
