(function (global, doc) {
    const filters = doc.querySelector('.ibexa-store-order-list__filters');

    if (!filters) {
        return;
    }

    const createdAtMin = filters.querySelector('[name="order_search[created_at_data][min]"]');
    const createdAtMax = filters.querySelector('[name="order_search[created_at_data][max]"]');
    const createdAtMinDummy = filters.querySelector('.ibexa-store-order-list__filters-created-at-min');
    const createdAtMaxDummy = filters.querySelector('.ibexa-store-order-list__filters-created-at-max');
    const setDummyInput = (dummyInput, realInput) => {
        if (!realInput.value) {
            return;
        }

        const timestamp = realInput.value * 1000;
        const date = new Date(timestamp);

        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

        dummyInput.value = date.toISOString().slice(0, 16);
    };
    const fillRealDateInput = (dummyInput, realInput) => {
        const date = new Date(dummyInput.value);
        const timestamp = date.getTime();

        realInput.value = timestamp / 1000;
    };

    setDummyInput(createdAtMinDummy, createdAtMin);
    setDummyInput(createdAtMaxDummy, createdAtMax);

    createdAtMinDummy.addEventListener('change', () => fillRealDateInput(createdAtMinDummy, createdAtMin), false);
    createdAtMaxDummy.addEventListener('change', () => fillRealDateInput(createdAtMaxDummy, createdAtMax), false);
})(window, window.document);
