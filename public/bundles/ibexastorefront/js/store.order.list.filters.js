(function (global, doc) {
    const filtersForm = doc.querySelector('.ibexa-store-order-list__filters-form');

    if (!filtersForm) {
        return;
    }

    const createdAtMin = filtersForm.querySelector('[name="order_search[created_at_data][min]"]');
    const createdAtMax = filtersForm.querySelector('[name="order_search[created_at_data][max]"]');
    const createdAtMinDummy = filtersForm.querySelector('.ibexa-store-order-list__filters-created-at-min');
    const createdAtMaxDummy = filtersForm.querySelector('.ibexa-store-order-list__filters-created-at-max');
    const statusSelect = filtersForm.querySelector('.ibexa-store-order-list__filters-status .ibexa-store-select');
    const sortSelect = filtersForm.querySelector('.ibexa-store-order-list__filters-sort-clause');
    const submitFiltersForm = () => {
        filtersForm.submit();
    };
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

    createdAtMinDummy.addEventListener(
        'change',
        () => {
            fillRealDateInput(createdAtMinDummy, createdAtMin);
            submitFiltersForm();
        },
        false,
    );
    createdAtMaxDummy.addEventListener(
        'change',
        () => {
            fillRealDateInput(createdAtMinDummy, createdAtMin);
            submitFiltersForm();
        },
        false,
    );

    statusSelect.addEventListener(
        'change',
        () => {
            submitFiltersForm();
        },
        false,
    );
    sortSelect.addEventListener(
        'change',
        () => {
            submitFiltersForm();
        },
        false,
    );
})(window, window.document);
