import Cart from '@ibexa-cart/src/bundle/Resources/public/js/component/cart';
import * as cartService from '@ibexa-cart/src/bundle/Resources/public/js/service/cart';
import { errorHandler } from '../helper/error.helper';

export default class StorefrontCart extends Cart {
    createCart() {
        return super.createCart(...arguments).catch(errorHandler);
    }

    loadCart() {
        const cartIdentifier = document.querySelector('meta[name="CartIdentifier"]')?.content;

        if (cartIdentifier) {
            return cartService
                .loadCart(cartIdentifier)
                .then((response) => {
                    cartService.loadCartSummary(cartIdentifier).then((summaryResponse) => {
                        this.cartData = response.Cart;
                        this.cartSummary = summaryResponse.CartSummary;
                        this.onCartDataChanged();
                    });
                })
                .catch(errorHandler);
        }

        return super.loadCart(...arguments).catch(errorHandler);
    }

    addProduct() {
        return super.addProduct(...arguments).catch(errorHandler);
    }

    updateEntryQuantity() {
        return super.updateEntryQuantity(...arguments).catch(errorHandler);
    }

    removeEntry() {
        return super.removeEntry(...arguments).catch(errorHandler);
    }

    empty() {
        return super.empty(...arguments).catch(errorHandler);
    }
}
