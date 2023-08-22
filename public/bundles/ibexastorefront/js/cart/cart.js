import Cart from '@ibexa-cart/src/bundle/Resources/public/js/component/cart';
import { errorHandler } from '../helper/error.helper';

export default class StorefrontCart extends Cart {
    createCart() {
        return super.createCart(...arguments).catch(errorHandler);
    }

    loadCart() {
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
