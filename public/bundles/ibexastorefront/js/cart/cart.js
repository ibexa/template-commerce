import Cart from '@ibexa-cart/src/bundle/Resources/public/js/component/cart';
import { errorHandler } from '../helper/error.helper';

export default class StorefrontCart extends Cart {
    createCart() {
        super.createCart(...arguments).catch(errorHandler);
    }

    loadCart() {
        super.loadCart(...arguments).catch(errorHandler);
    }

    addProduct() {
        super.addProduct(...arguments).catch(errorHandler);
    }

    updateEntryQuantity() {
        super.updateEntryQuantity(...arguments).catch(errorHandler);
    }

    removeEntry() {
        super.removeEntry(...arguments).catch(errorHandler);
    }

    empty() {
        super.empty(...arguments).catch(errorHandler);
    }
}
