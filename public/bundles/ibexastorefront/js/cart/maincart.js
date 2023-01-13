import Maincart from '@ibexa-cart/src/bundle/Resources/public/js/component/maincart';
import Summary from '@ibexa-cart/src/bundle/Resources/public/js/component/summary';

export default class StorefrontMaincart extends Maincart {
    constructor(options) {
        super(options);

        this.summaryWrapperNode = this.container.querySelector('.ibexa-store-maincart__summary-wrapper');
        this.emptyCartContainerNode = this.container.querySelector('.ibexa-store-maincart__empty-cart-container');
        this.itemsCounterValueNode = this.container.querySelector('.ibexa-store-maincart__items-counter-value');
        this.clearCartBtn = this.container.querySelector('.ibexa-store-maincart__clear-cart-btn');

        this.cartSummary = null;

        this.onCartClear = this.onCartClear.bind(this);
    }

    init() {
        super.init(...arguments);

        this.attachStorefrontMaincartListeners();

        this.cartSummary = new Summary({
            container: this.summaryWrapperNode,
        });
        this.cartSummary.init();
    }

    attachStorefrontMaincartListeners() {
        this.clearCartBtn.addEventListener('click', this.onCartClear, false);

        document.body.addEventListener(
            'ibexa-cart:cart-data-changed',
            () => {
                this.toggleSummary();
                this.refreshEmptyCart();
                this.refreshItemsCounter();
            },
            false,
        );
    }

    updateItem(entry) {
        super.updateItem(...arguments);

        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const {
            Price: {
                RestPrice: { formatted: productPriceNetFormatted },
            },
            SubtotalPrice: {
                RestPrice: { formatted: subtotalPriceNetFormatted },
            },
        } = entrySummary;
        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const subtotalPriceNode = itemNode.querySelector('.ibexa-store-maincart-item__subtotal-price-net');
        const priceNode = itemNode.querySelector('.ibexa-store-maincart-item__price-net');

        subtotalPriceNode.innerText = subtotalPriceNetFormatted;
        priceNode.innerText = productPriceNetFormatted;
    }

    checkIsCartEmpty() {
        const cartEntries = this.cart.getEntries();
        const isCartEmpty = !cartEntries.length;

        return isCartEmpty;
    }

    toggleSummary() {
        const isCartEmpty = this.checkIsCartEmpty();

        if (isCartEmpty) {
            this.summaryWrapperNode.classList.add('ibexa-store-maincart__summary-wrapper--hidden');
        } else {
            this.summaryWrapperNode.classList.remove('ibexa-store-maincart__summary-wrapper--hidden');
        }
    }

    refreshEmptyCart() {
        const isCartEmpty = this.checkIsCartEmpty();

        this.emptyCartContainerNode.classList.toggle('ibexa-store-maincart__empty-cart-container--hidden', !isCartEmpty);
    }

    renderItem(entry) {
        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const {
            Price: {
                RestPrice: { formatted: productPriceNetFormatted },
            },
            SubtotalPrice: {
                RestPrice: { formatted: subtotalPriceNetFormatted },
            },
            Product: {
                code: productCode,
                Thumbnail: { resource: productThumbnailImg },
            },
        } = entrySummary;
        const itemRenderedPartly = super.renderItem(entry);
        const itemRendered = itemRenderedPartly
            .replaceAll('{{ product_name }}', this.cart.getEntryProductName(entry.identifier))
            .replaceAll('{{ product_code }}', productCode)
            .replaceAll('{{ product_price_net }}', productPriceNetFormatted)
            .replaceAll('{{ product_image_url }}', productThumbnailImg)
            .replaceAll('{{ subtotal_price }}', subtotalPriceNetFormatted);

        return itemRendered;
    }

    onItemInserted(entry, itemNode) {
        super.onItemInserted(...arguments);

        this.setAvailability(entry, itemNode);
    }

    setAvailability(entry, itemNode) {
        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const {
            Product: {
                Availability: { is_available: isAvailable },
            },
        } = entrySummary;
        const availabilityNode = itemNode.querySelector('.ibexa-store-maincart-item__availability');

        availabilityNode.classList.toggle('ibexa-store-maincart-item__availability--out', !isAvailable);
        availabilityNode.classList.toggle('ibexa-store-maincart-item__availability--in', isAvailable);
    }

    refreshItemsCounter() {
        this.itemsCounterValueNode.innerText = this.cart.getEntries().length;
    }

    onCartClear() {
        this.cart.empty();
    }
}
