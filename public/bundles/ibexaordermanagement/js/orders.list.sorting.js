(function (global, doc) {
    const searchForm = doc.querySelector('.ibexa-om-orders-filters');
    const searchSortOrderSelect = doc.querySelector('.ibexa-om-orders-filters__sort-order-select');
    const listSortOrderSelect = doc.querySelector('.ibexa-om-orders-list__sort-order-select');
    const sortResults = ({ currentTarget }) => {
        const sortOrderValue = currentTarget.value;

        searchSortOrderSelect.value = sortOrderValue;
        searchForm.submit();
    };

    if (searchSortOrderSelect && listSortOrderSelect) {
        listSortOrderSelect.addEventListener('change', sortResults, false);
    }
})(window, window.document);
