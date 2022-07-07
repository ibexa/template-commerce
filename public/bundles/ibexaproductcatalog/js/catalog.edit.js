import ChoiceFilterConfig from './filterConfig/choice.filter.config';
import TaggifyFilterConfig from './filterConfig/taggify.filter.config';
import RadioFilterConfig from './filterConfig/radio.filter.config';

const DOTS = '...';

(function (global, doc, ibexa, Translator, Routing) {
    const configuredFiltersNode = doc.querySelector('.ibexa-pc-edit-catalog-filters__configured');
    const configuredFiltersListTogglerBtns = doc.querySelectorAll('.ibexa-pc-edit-catalog-filters__configured-header-toggler');
    const configPanelsNode = doc.querySelectorAll('.ibexa-pc-edit-config-filter');
    const availableFiltersPopupNode = doc.querySelector('.ibexa-pc-edit-catalog-filters__available-popup');
    const availableFiltersPopupTriggerBtn = doc.querySelector('.ibexa-pc-edit-catalog-filters__available-popup-trigger');
    const configuredFiltersListNode = doc.querySelector('.ibexa-pc-edit-catalog-filters__configured-list');
    const previewProductsWrapper = doc.querySelector('.ibexa-pc-edit-catalog-products__preview-wrapper');
    const previewProductsList = previewProductsWrapper.querySelector('.ibexa-pc-edit-catalog-products__list');
    const previewPagination = previewProductsWrapper.querySelector('.ibexa-pc-edit-catalog-products__pagination');
    const searchWidget = doc.querySelector('.ibexa-pc-edit-catalog-products__search');
    const searchInput = searchWidget.querySelector('.ibexa-input--text');
    const searchBtn = searchWidget.querySelector('.ibexa-input-text-wrapper__action-btn--search');
    const filtersConfig = [];
    const filtersConfigClassMap = {
        choice: ChoiceFilterConfig,
        taggify: TaggifyFilterConfig,
        radio: RadioFilterConfig,
    };
    let currentPage = 1;
    let savedSearchValue = '';
    const triggerSearch = () => {
        savedSearchValue = searchInput.value;
        currentPage = 1;

        refreshProductsList();
    };
    const goToPage = (pageNumber) => {
        currentPage = pageNumber;

        refreshProductsList();
    };
    const triggerFilterChange = () => {
        currentPage = 1;

        refreshProductsList();
    };
    const createPaginationWidget = (currentCount, pagesCount = parseInt(previewPagination.dataset.pagesCount, 10)) => {
        const additionalInfo = previewPagination.querySelector('.ibexa-pagination__info');
        const additionalInfoTemplate = additionalInfo.dataset.template.replace('{{ viewing }}', currentCount);
        const navigation = previewPagination.querySelector('.ibexa-pagination__navigation');
        const listElementNavigationTemplate = navigation.dataset.template;
        const pages = ibexa.helpers.pagination.computePages({
            activePageIndex: currentPage,
            pagesCount,
            separator: DOTS,
        });
        const fragment = doc.createDocumentFragment();

        // add prev and next buttons
        pages.unshift('');
        pages.push('');

        pages.forEach((page, key) => {
            const container = doc.createElement('ul');

            container.insertAdjacentHTML('beforeend', listElementNavigationTemplate);

            const filledListElemenet = container.innerHTML.replaceAll('{{ page }}', page);

            container.innerHTML = '';
            container.insertAdjacentHTML('beforeend', filledListElemenet);

            const listItemNode = container.querySelector('li');

            if (page === DOTS) {
                listItemNode.classList.add('disabled');
            } else {
                let nextPage = page;

                if (key === 0) {
                    nextPage = currentPage - 1;
                } else if (key === pages.length - 1) {
                    nextPage = currentPage + 1;
                }

                listItemNode.addEventListener('click', () => goToPage(nextPage));
            }

            if (page === currentPage) {
                listItemNode.classList.add('active');
            }

            fragment.append(listItemNode);
        });

        const prevButtonClassList = fragment.querySelector('.page-item:first-child').classList;
        const nextButtonClassList = fragment.querySelector('.page-item:last-child').classList;

        prevButtonClassList.add('prev');
        prevButtonClassList.toggle('disabled', currentPage === 1);
        nextButtonClassList.add('next');
        nextButtonClassList.toggle('disabled', currentPage === pagesCount);

        additionalInfo.innerHTML = additionalInfoTemplate;
        navigation.innerHTML = '';
        navigation.append(fragment);
    };
    const addFilterPreview = ({ currentTarget }) => {
        const { filterId } = currentTarget.dataset;

        filtersConfig[filterId].addPreview(true);
    };
    const toggleFilterList = ({ currentTarget }) => {
        const showLabel = Translator.trans(/*@Desc("Show")*/ 'catalog.edit.filters.toggler.show', {}, 'product_catalog');
        const hideLabel = Translator.trans(/*@Desc("Hide")*/ 'catalog.edit.filters.toggler.hide', {}, 'product_catalog');

        currentTarget.classList.toggle('ibexa-pc-edit-catalog-filters__configured-header-toggler--list-rolled-up');
        configuredFiltersNode.classList.toggle('ibexa-pc-edit-catalog-filters__configured--list-rolled-up');

        const isListRolledUp = configuredFiltersNode.classList.contains('ibexa-pc-edit-catalog-filters__configured--list-rolled-up');

        currentTarget.innerHTML = isListRolledUp ? showLabel : hideLabel;
    };
    const refreshProductsList = () => {
        searchInput.value = savedSearchValue;

        const queryParams = {
            page: currentPage,
        };

        if (searchInput.value != '') {
            queryParams['products_preview[search][query]'] = searchInput.value;
        }

        Object.entries(filtersConfig).forEach(([filterConfigKey, filterConfig]) => {
            const queryParamName = filterConfigKey.replace('catalog_update_criteria_', '');
            const queryParamKey = `products_preview[filters][${queryParamName}]`;
            const queryParamValue = filterConfig.getValue();
            const isParamValueArray = Array.isArray(queryParamValue);

            if (isParamValueArray) {
                queryParamValue.forEach((value, key) => {
                    queryParams[`${queryParamKey}[${key}]`] = value;
                });
            } else if (queryParamValue !== undefined) {
                queryParams[queryParamKey] = queryParamValue;
            }
        });

        const catalogPreviewUrl = Routing.generate('ibexa.product_catalog.catalog.products.preview.list', queryParams);

        fetch(catalogPreviewUrl, { mode: 'same-origin', credentials: 'same-origin' })
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then((response) => {
                const { rowTemplate } = previewProductsList.dataset;
                const tableBody = previewProductsList.querySelector('.ibexa-table__body');
                const fragment = doc.createDocumentFragment();

                response.products.forEach((product) => {
                    const container = doc.createElement('tbody');

                    container.insertAdjacentHTML('beforeend', rowTemplate);

                    const filledRow = container.innerHTML
                        .replaceAll('{{ PRODUCT_NAME }}', product.name)
                        .replace('{{ PRODUCT_URL }}', product.view_url)
                        .replace('{{ PRODUCT_IMG }}', product.thumbnail)
                        .replace('{{ PRODUCT_CODE }}', product.code)
                        .replace('{{ PRODUCT_TYPE }}', product.type)
                        .replace('{{ PRODUCT_CREATED_DATE }}', product.created_at)
                        .replace('{{ PRODUCT_STATUS }}', !product.is_available ? 'ibexa-pc-availability-dot--not-available' : '');

                    container.innerHTML = '';
                    container.insertAdjacentHTML('beforeend', filledRow);

                    const tableItemNode = container.querySelector('tr');

                    fragment.append(tableItemNode);
                });

                tableBody.innerHTML = '';
                tableBody.append(fragment);
                createPaginationWidget(response.products.length, response.pages_count);

                previewProductsWrapper.classList.toggle(
                    'ibexa-pc-edit-catalog-products__preview-wrapper--hidden',
                    response.products.length === 0,
                );
            })
            .catch(ibexa.helpers.notification.showErrorNotification);
    };

    configPanelsNode.forEach((configPanelNode) => {
        const { filterId, filterType } = configPanelNode.dataset;
        const productsListFilterNode = doc.querySelector(`.ibexa-pc-edit-catalog-list-filter[data-filter-id="${filterId}"]`);
        const relatedAvailablePopupItem = doc
            .querySelector(`.ibexa-popup-menu__item-content[data-filter-id="${filterId}"]`)
            .closest('.ibexa-popup-menu__item');
        const FiltersTypeClass = filtersConfigClassMap[filterType];

        filtersConfig[filterId] = new FiltersTypeClass({
            configPanelNode,
            productsListFilterNode,
            relatedAvailablePopupItem,
            configuredFiltersListNode,
        });

        filtersConfig[filterId].init();
    });
    configuredFiltersListTogglerBtns.forEach((configuredFiltersListTogglerBtn) => {
        configuredFiltersListTogglerBtn.addEventListener('click', toggleFilterList, false);
    });
    searchBtn.addEventListener('click', triggerSearch, false);

    new ibexa.core.PopupMenu({
        triggerElement: availableFiltersPopupTriggerBtn,
        popupMenuElement: availableFiltersPopupNode,
        onItemClick: addFilterPreview,
    });

    createPaginationWidget(previewPagination.dataset.currentCount, parseInt(previewPagination.dataset.pagesCount, 10));

    doc.body.addEventListener('ibexa-pc-filters:change', triggerFilterChange, false);
})(window, window.document, window.ibexa, window.Translator, window.Routing);
