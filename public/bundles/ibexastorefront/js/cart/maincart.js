import Maincart from '@ibexa-cart/src/bundle/Resources/public/js/component/maincart';
import Summary from '@ibexa-cart/src/bundle/Resources/public/js/component/summary';

import { escapeHTML } from '@ibexa-cart/src/bundle/Resources/public/js/helper/text.helper';
import { errorHandler } from '../helper/error.helper';

export default class StorefrontMaincart extends Maincart {
    constructor(options) {
        super(options);

        this.summaryWrapperNode = this.container.querySelector('.ibexa-store-maincart__summary-wrapper');
        this.summaryWrapperNode = this.container.querySelector('.ibexa-store-maincart__summary-wrapper');
        this.emptyCartContainerNode = this.container.querySelector('.ibexa-store-maincart__empty-cart-container');
        this.itemsCounterValueNode = this.container.querySelector('.ibexa-store-maincart__items-counter-value');
        this.clearCartBtn = this.container.querySelector('.ibexa-store-maincart__clear-cart-btn');
        this.goToCheckoutBtn = this.summaryWrapperNode.querySelector('.ibexa-store-maincart-summary__action--go-to-checkout');

        this.entryViolationStatusTemplate = this.itemsContainerNode.dataset.entryViolationStatusTemplate;
        this.productsToHighlightCodes = this.container.dataset.productsToHighlightCodes;

        this.quantityChangeErrorHighlightTimeout = 2100;

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
                this.toggleGoToCheckoutBtn();
                this.refreshEmptyCart();
                this.refreshItemsCounter();
            },
            false,
        );
    }

    updateItem(entry) {
        super.updateItem(...arguments);

        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const productPriceNetFormatted = entrySummary?.Price?.RestPrice?.formatted ?? '';
        const subtotalPriceNetFormatted = entrySummary?.SubtotalPrice?.RestPrice?.formatted ?? '';
        const originalPriceNetFormatted = entrySummary?.Price?.RestPrice?.Price?.RestPrice?.formatted;
        const originalSubtotalPriceNetFormatted = entrySummary?.OriginalSubtotalPrice?.RestPrice?.formatted;
        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const subtotalPriceNode = itemNode.querySelector('.ibexa-store-maincart-item__subtotal-price-net');
        const priceNode = itemNode.querySelector('.ibexa-store-maincart-item__price-net');
        const subtotalOriginalPriceNode = itemNode.querySelector('.ibexa-store-maincart-item__subtotal-original-price-net');
        const originalPriceNode = itemNode.querySelector('.ibexa-store-maincart-item__price-original-net');

        subtotalPriceNode.innerText = this.netPriceTemplate.replace('{{ price }}', subtotalPriceNetFormatted);
        priceNode.innerText = this.netPriceTemplate.replace('{{ price }}', productPriceNetFormatted);

        if (subtotalOriginalPriceNode !== null) {
            subtotalOriginalPriceNode.innerText = this.netPriceTemplate.replace('{{ price }}', originalSubtotalPriceNetFormatted);
        }

        if (originalPriceNode !== null) {
            originalPriceNode.innerText = this.netPriceTemplate.replace('{{ price }}', originalPriceNetFormatted);
        }

        this.setAvailability(entry, itemNode);
    }

    checkIsCartEmpty() {
        const cartEntries = this.cart.getEntries();
        const isCartEmpty = !cartEntries.length;

        return isCartEmpty;
    }

    toggleSummary() {
        const isCartEmpty = this.checkIsCartEmpty();

        this.summaryWrapperNode.classList.toggle('ibexa-store-maincart__summary-wrapper--hidden', isCartEmpty);
    }

    toggleGoToCheckoutBtn() {
        const cartSummary = this.cart.getCartSummary();
        const hasAnyViolations = !!cartSummary.CartConstraintViolationList.violations.length;

        this.goToCheckoutBtn.toggleAttribute('disabled', hasAnyViolations);
    }

    refreshEmptyCart() {
        const isCartEmpty = this.checkIsCartEmpty();

        this.emptyCartContainerNode.classList.toggle('ibexa-store-maincart__empty-cart-container--hidden', !isCartEmpty);
    }

    renderItem(entry) {
        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const productPriceNetFormatted = entrySummary?.Price?.RestPrice?.formatted ?? '';
        const subtotalPriceNetFormatted = entrySummary?.SubtotalPrice?.RestPrice?.formatted ?? '';
        const originalPriceNetFormatted = entrySummary?.Price?.RestPrice?.Price?.RestPrice?.formatted;
        const originalSubtotalPriceNetFormatted = entrySummary?.OriginalSubtotalPrice?.RestPrice.formatted;
        const productCode = entrySummary?.Product?.code ?? '';
        const productThumbnailImg = entrySummary?.Product?.Thumbnail?.resource ?? '/placeholder';
        const itemRenderedPartly = super.renderItem(entry);
        const itemRendered = itemRenderedPartly
            .replaceAll('{{ product_name }}', escapeHTML(this.cart.getEntryProductName(entry.identifier)))
            .replaceAll('{{ product_code }}', escapeHTML(productCode))
            .replaceAll('{{ product_price_net }}', this.netPriceTemplate.replace('{{ price }}', productPriceNetFormatted))
            .replaceAll('{{ product_image_url }}', escapeHTML(productThumbnailImg))
            .replaceAll('{{ subtotal_price }}', this.netPriceTemplate.replace('{{ price }}', subtotalPriceNetFormatted))
            .replaceAll('{{ product_price_original_net }}', this.netPriceTemplate.replace('{{ price }}', originalPriceNetFormatted))
            .replaceAll(
                '{{ product_price_original_subtotal }}',
                this.netPriceTemplate.replace('{{ price }}', originalSubtotalPriceNetFormatted),
            );

        return itemRendered;
    }

    onItemInserted(entry, itemNode) {
        super.onItemInserted(...arguments);

        this.setAvailability(entry, itemNode);
        this.setHighlight(entry, itemNode);
    }

    setAvailability(entry, itemNode) {
        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const isAvailable = entrySummary?.Product?.Availability?.is_available ?? false;
        const availabilityNode = itemNode.querySelector('.ibexa-store-maincart-item__availability');

        availabilityNode.classList.toggle('ibexa-store-maincart-item__availability--out', !isAvailable);
        availabilityNode.classList.toggle('ibexa-store-maincart-item__availability--in', isAvailable);
    }

    setHighlight(entry, itemNode) {
        const entrySummary = this.cart.getEntrySummaryByIdentifier(entry.identifier);
        const productCode = entrySummary?.Product?.code ?? '';
        const shouldBeHighlighted = this.productsToHighlightCodes.includes(productCode);

        itemNode.classList.toggle('ibexa-store-maincart-item--highlighted', shouldBeHighlighted);
    }

    refreshItemsCounter() {
        this.itemsCounterValueNode.innerText = this.cart.getEntries().length;
    }

    handleItemRemove() {
        super.handleItemRemove(...arguments).catch(errorHandler);
    }

    onCartClear() {
        this.cart.empty(...arguments).catch(errorHandler);
    }

    addEntryInvalidState(entry, entryViolations) {
        super.addEntryInvalidState(entry, entryViolations);

        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const availabilityNode = itemNode.querySelector('.ibexa-store-maincart-item__availability');
        const statusesContainer = itemNode.querySelector('.ibexa-store-maincart-item__statuses');

        availabilityNode.classList.add('ibexa-store-maincart-item__availability--hidden');
        itemNode.classList.add('ibexa-store-maincart-item--invalid');
        entryViolations.forEach((violation) => {
            const violationStatusRendered = this.entryViolationStatusTemplate.replaceAll('{{ content }}', violation.message);

            statusesContainer.insertAdjacentHTML('beforeend', violationStatusRendered);
        });
    }

    removeEntryInvalidState(entry) {
        super.removeEntryInvalidState(entry);

        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const availabilityNode = itemNode.querySelector('.ibexa-store-maincart-item__availability');
        const violationStatuses = itemNode.querySelectorAll('.ibexa-store-maincart-item__entry-violation-status');

        availabilityNode.classList.remove('ibexa-store-maincart-item__availability--hidden');
        itemNode.classList.remove('ibexa-store-maincart-item--invalid');
        violationStatuses.forEach((violationStatus) => violationStatus.remove());
    }

    showQuantityChangeErrorInputHighlight(quantityInput) {
        quantityInput.classList.add('ibexa-store-add-to-cart__quantity-input--highlight');

        setTimeout(() => {
            quantityInput.classList.remove('ibexa-store-add-to-cart__quantity-input--highlight');
        }, this.quantityChangeErrorHighlightTimeout);
    }

    handleQuantityInputChange({ target: quantityInput }) {
        const productAdded = super.handleQuantityInputChange(...arguments);

        if (productAdded instanceof Promise) {
            productAdded.catch(() => {
                this.showQuantityChangeErrorInputHighlight(quantityInput);
            });
        }
    }
}
