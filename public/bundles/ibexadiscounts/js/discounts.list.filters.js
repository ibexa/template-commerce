(function (global, doc, ibexa) {
    const { getInstance } = ibexa.helpers.objectInstances;
    const createdDropdownInputNode = doc.querySelector('#discount_search_created_at');
    const validityPeriodDropdownInputNode = doc.querySelector('#discount_search_validity_period');
    const filtersNode = doc.querySelector('.ibexa-dc-discounts-list-filters');
    const createdDateTimeRangeNode = filtersNode.querySelector('.ibexa-dc-discounts-list-filters__created-at-date-time-range');
    const createdDateTimeRange = getInstance(createdDateTimeRangeNode);
    const validityPeriodDateTimeRangeNode = filtersNode.querySelector('.ibexa-dc-discounts-list-filters__validity-period-date-time-range');
    const validityPeriodDateTimeRange = getInstance(validityPeriodDateTimeRangeNode);
    const toggleDatesSelectVisibility = (event, dateTimeRange) => {
        const datesRangeNode = doc.querySelector(event.target.dataset.targetSelector);

        if (event.target.value !== 'custom_range') {
            dateTimeRange.toggleHidden(true);

            dateTimeRange.clearDates();
            doc.querySelector(datesRangeNode.dataset.periodSelector).value = event.target.value;

            return;
        }

        dateTimeRange.toggleHidden(false);
    };

    createdDropdownInputNode.addEventListener('change', (event) => toggleDatesSelectVisibility(event, createdDateTimeRange), false);
    validityPeriodDropdownInputNode.addEventListener(
        'change',
        (event) => toggleDatesSelectVisibility(event, validityPeriodDateTimeRange),
        false,
    );
})(window, window.document, window.ibexa);
