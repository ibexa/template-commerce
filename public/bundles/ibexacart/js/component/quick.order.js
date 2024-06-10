import { guardQuantityInputValue } from '../helper/quantity.input';

export default class QuickOrder {
    constructor(options) {
        if (!options.container) {
            throw new Error('QuickOrder: container option must be specified!');
        }

        this.container = options.container;

        this.fileInput = options.fileInput ?? this.container.querySelector('.ibexa-crt-quick-order__file');
        this.addEntryBtn = options.addEntryBtn ?? this.container.querySelector('.ibexa-crt-quick-order__add-entry-btn');
        this.entriesContainer = options.entriesContainer ?? this.container.querySelector('.ibexa-crt-quick-order__entries');
        this.entriesPrototype = options.entriesPrototype ?? this.entriesContainer.dataset.prototype;

        this.newEntryIndex = 0;

        this.isDuringProcessing = false;

        this.attachEntryEventListeners = this.attachEntryEventListeners.bind(this);
        this.handleEntryDelete = this.handleEntryDelete.bind(this);
        this.handleEntryAdd = this.handleEntryAdd.bind(this);
        this.getMaxQuantity = this.getMaxQuantity.bind(this);
    }

    init() {
        const initialEntries = this.container.querySelectorAll('.ibexa-crt-quick-order__entry');

        this.newEntryIndex = initialEntries.length;

        initialEntries.forEach(this.attachEntryEventListeners);

        this.addEntryBtn?.addEventListener('click', this.handleEntryAdd, false);
    }

    attachEntryEventListeners(entry) {
        const deleteEntryBtn = entry.querySelector('.ibexa-crt-quick-order__delete-entry-btn');
        const quantityInput = entry.querySelector('.ibexa-crt-quick-order__quantity-input');

        deleteEntryBtn?.addEventListener('click', this.handleEntryDelete, false);

        guardQuantityInputValue(quantityInput, this.getMaxQuantity);
    }

    getMaxQuantity() {
        return Number.MAX_SAFE_INTEGER;
    }

    addNewEntry() {
        const renderedEntry = this.entriesPrototype.replaceAll('__entry_index__', this.newEntryIndex);

        this.entriesContainer.insertAdjacentHTML('beforeend', renderedEntry);
        this.newEntryIndex += 1;

        const insertedEntry = this.entriesContainer.lastElementChild;
        this.attachEntryEventListeners(insertedEntry);
    }

    handleEntryAdd() {
        this.addNewEntry();
    }

    handleEntryDelete(event) {
        const deleteBtn = event.currentTarget;
        const entry = deleteBtn.closest('.ibexa-crt-quick-order__entry');

        entry.remove();

        const entries = this.container.querySelectorAll('.ibexa-crt-quick-order__entry');
        const entriesCount = entries.length;

        if (entriesCount === 0) {
            this.addNewEntry();
        }
    }
}
