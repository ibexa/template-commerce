(function (global, doc) {
    const sortOrderSelects = doc.querySelectorAll('.ibexa-store-sort-order-select');

    sortOrderSelects.forEach((sortOrderSelect) => {
        const { originalSelectSelector } = sortOrderSelect.dataset;
        const originalSelect = document.querySelector(originalSelectSelector);
        const form = originalSelect.closest('form');
        const sortResults = () => {
            const sortOrderValue = sortOrderSelect.value;

            originalSelect.value = sortOrderValue;
            form.submit();
        };

        sortOrderSelect.addEventListener('change', sortResults, false);
    });
})(window, window.document);
