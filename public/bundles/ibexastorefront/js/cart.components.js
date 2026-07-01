import StorefrontAddToCart from './cart/add.to.cart';
import StorefrontMaincart from './cart/maincart';
import StorefrontCart from './cart/cart';
import StorefrontMinicart from './cart/minicart';
import StorefrontQuickOrder from './cart/quick.order';

(function (global, doc) {
    const minicartContainer = doc.querySelector('.ibexa-store-minicart');
    const maincartContainer = doc.querySelector('.ibexa-store-maincart');
    const addToCartsContainers = doc.querySelectorAll('.ibexa-store-add-to-cart');
    const quickOrderContainers = doc.querySelectorAll('.ibexa-store-quick-order');

    new StorefrontCart();

    if (minicartContainer) {
        const minicart = new StorefrontMinicart({ container: minicartContainer });

        minicart.init();
    }

    if (maincartContainer) {
        const maincart = new StorefrontMaincart({ container: maincartContainer });

        maincart.init();
    }

    addToCartsContainers.forEach((container) => {
        const addToCart = new StorefrontAddToCart({ container });

        addToCart.init();
    });

    quickOrderContainers.forEach((container) => {
        const quickOrder = new StorefrontQuickOrder({ container });

        quickOrder.init();
    });
})(window, window.document);
