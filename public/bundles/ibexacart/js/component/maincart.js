import { getValidQuantity, guardQuantityInputValue } from '../helper/quantity.input';

export default class Maincart {
    constructor(options) {
        if (!options.container) {
            throw new Error('Maincart: container option must be specified!');
        }

        this.container = options.container;

        this.cart = options.cart ?? window.ibexaCart;
        this.quantityChangeDebounceTimeout = options.quantityChangeDebounceTimeout ?? 1000;
        this.emptyCartTemplate = this.container.dataset.emptyCartTemplate;
        this.maincartNode = options.container.classList.contains('ibexa-crt-maincart')
            ? options.container
            : this.container.querySelector('.ibexa-crt-maincart');
        this.itemsContainerNode = options.itemsContainerNode ?? this.container.querySelector('.ibexa-crt-maincart__items-container');
        this.itemTemplate = this.itemsContainerNode.dataset.itemTemplate;
        this.netPriceTemplate = this.maincartNode.dataset.netPriceTemplate;

        this.entriesInternalData = {};

        this.handleCartChanged = this.handleCartChanged.bind(this);
    }

    init() {
        this.attachMaincartEventListeners();
    }

    getCurrentEntriesIdentifiers() {
        const currentEntries = [...this.itemsContainerNode.querySelectorAll('.ibexa-crt-maincart__item')];
        const currentEntriesIdentifiers = currentEntries.map((entry) => entry.dataset.cartEntryIdentifier);

        return currentEntriesIdentifiers;
    }

    attachMaincartEventListeners() {
        document.body.addEventListener('ibexa-cart:cart-data-changed', this.handleCartChanged, false);
    }

    attachItemEventListeners(entry, itemNode) {
        const removeItemBtn = itemNode.querySelector('.ibexa-crt-maincart__remove-item-btn');
        const quantityInput = itemNode.querySelector('.ibexa-crt-maincart__quantity-input');

        guardQuantityInputValue(quantityInput, () => this.getMaxQuantity(entry));

        removeItemBtn?.addEventListener('click', (event) => this.handleItemRemove(event, entry), false);
        quantityInput?.addEventListener('change', (event) => this.handleQuantityInputChangeDebounced(event, entry), false);
        quantityInput?.addEventListener('keyup', (event) => this.handleQuantityInputChangeDebounced(event, entry), false);
    }

    handleCartChanged({ detail: { cart } }) {
        if (this.cart !== cart) {
            return;
        }

        const entries = cart.getEntries();
        const entriesIdentifiers = entries.map((entry) => entry.identifier);
        const currentEntriesIdentifiers = this.getCurrentEntriesIdentifiers();
        const oldEntriesIdentifiers = currentEntriesIdentifiers.filter((currentEntry) => entriesIdentifiers.includes(currentEntry));
        const newEntriesIdentifiers = entriesIdentifiers.filter((entry) => !currentEntriesIdentifiers.includes(entry));
        const deletedEntriesIdentifiers = currentEntriesIdentifiers.filter((currentEntry) => !entriesIdentifiers.includes(currentEntry));

        oldEntriesIdentifiers.forEach((entryIdentifier) => this.updateItem(this.cart.getEntryByIdentifier(entryIdentifier)));
        newEntriesIdentifiers.forEach((entryIdentifier) => {
            const entry = this.cart.getEntryByIdentifier(entryIdentifier);

            this.setNewEntryDefaultInternalData(entry);
            this.insertItem(entry);
        });
        deletedEntriesIdentifiers.forEach((entryIdentifier) => this.removeItem(entryIdentifier));
    }

    setNewEntryDefaultInternalData(entry) {
        this.entriesInternalData[entry.identifier] = {
            isDuringUpdate: false,
            entryQuantityInputChangeTimeoutId: null,
        };
    }

    getEntryInternalData(entryIdentifier) {
        return this.entriesInternalData[entryIdentifier];
    }

    handleItemRemove(event, entry) {
        this.cart.removeEntry(entry.identifier);
    }

    handleQuantityInputChangeDebounced(event, entry) {
        const entryInternalData = this.getEntryInternalData(entry.identifier);
        const isEntryDuringUpdate = entryInternalData.isDuringUpdate;

        if (isEntryDuringUpdate) {
            return;
        }

        const { entryQuantityInputChangeTimeoutId } = entryInternalData;

        clearTimeout(entryQuantityInputChangeTimeoutId);

        const { target: quantityInput } = event;
        const newQuantityValue = quantityInput.value;
        const validQuantity = getValidQuantity(newQuantityValue, 1, () => this.getMaxQuantity(entry));
        const isNewQuantityValid = validQuantity.toString() === newQuantityValue;

        if (!isNewQuantityValid) {
            return;
        }

        entryInternalData.entryQuantityInputChangeTimeoutId = setTimeout(() => {
            entryInternalData.isDuringUpdate = true;
            this.handleQuantityInputChange(event, entry);
        }, this.quantityChangeDebounceTimeout);
    }

    handleQuantityInputChange({ target: quantityInput }, entry) {
        const newQuantity = parseInt(quantityInput.value, 10);

        if (newQuantity === entry.quantity) {
            return;
        }

        let restoreFocus = quantityInput === document.activeElement;
        const handleFocusIn = () => {
            restoreFocus = false;
        };

        quantityInput.disabled = true;

        document.addEventListener('focusin', handleFocusIn, false);

        return this.cart.updateEntryQuantity(entry.identifier, newQuantity).finally(() => {
            const updatedEntry = this.cart.getEntryByIdentifier(entry.identifier);
            const entryInternalData = this.getEntryInternalData(entry.identifier);

            quantityInput.value = updatedEntry.quantity;
            quantityInput.disabled = false;

            document.removeEventListener('focusin', handleFocusIn, false);

            if (restoreFocus) {
                quantityInput.focus();
            }

            entryInternalData.isDuringUpdate = false;
        });
    }

    // eslint-disable-next-line no-unused-vars
    getMaxQuantity(entryIdentifier) {
        return Number.MAX_SAFE_INTEGER;
    }

    onItemInserted(entry, itemNode) {
        this.attachItemEventListeners(entry, itemNode);
    }

    findItemByEntryIdentifier(identifier) {
        return this.itemsContainerNode.querySelector(`[data-cart-entry-identifier="${identifier}"]`);
    }

    updateCartEmptyState() {
        const isCartEmpty = !!this.cart.getItems().length;

        this.maincartNode.classList.toggle('ibexa-crt-maincart--empty', isCartEmpty);
    }

    renderItem(entry) {
        const itemRendered = this.itemTemplate
            .replaceAll('{{ cart_entry_identifier }}', entry.identifier)
            .replaceAll('{{ cart_entry_quantity }}', entry.quantity);

        return itemRendered;
    }

    insertItem(entry) {
        const itemRendered = this.renderItem(entry);

        this.itemsContainerNode.insertAdjacentHTML('beforeend', itemRendered);

        const itemNode = this.findItemByEntryIdentifier(entry.identifier);

        this.setItemInvalidState(entry);
        this.onItemInserted(entry, itemNode);

        return itemNode;
    }

    removeItem(entryIdentifier) {
        const itemNode = this.findItemByEntryIdentifier(entryIdentifier);

        itemNode.remove();
    }

    updateItemQuantityInput(entry) {
        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const quantityInput = itemNode.querySelector('.ibexa-crt-maincart__quantity-input');

        quantityInput.value = entry.quantity;
    }

    setItemInvalidState(entry) {
        const entryViolations = this.cart.getEntryViolationByIdentifier(entry.identifier);
        const isEntryViolated = !!entryViolations.length;
        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const isMarkedAsInvalid = itemNode.classList.contains('ibexa-crt-maincart__item--invalid');

        if (isEntryViolated && !isMarkedAsInvalid) {
            this.addEntryInvalidState(entry, entryViolations);
        } else if (!isEntryViolated && isMarkedAsInvalid) {
            this.removeEntryInvalidState(entry);
        }
    }

    // eslint-disable-next-line no-unused-vars
    addEntryInvalidState(entry, entryViolations) {
        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const quantityInput = itemNode.querySelector('.ibexa-crt-maincart__quantity-input');

        itemNode.classList.add('ibexa-crt-maincart__item--invalid');
        quantityInput.disabled = true;
    }

    removeEntryInvalidState(entry) {
        const itemNode = this.findItemByEntryIdentifier(entry.identifier);
        const quantityInput = itemNode.querySelector('.ibexa-crt-maincart__quantity-input');

        itemNode.classList.remove('ibexa-crt-maincart__item--invalid');
        quantityInput.disabled = false;
    }

    updateItem(entry) {
        this.updateItemQuantityInput(entry);
        this.setItemInvalidState(entry);
    }
}
