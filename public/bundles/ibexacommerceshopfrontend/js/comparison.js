(function(global, doc, ibexa) {
    const COMPARISON_ITEM_WIDTH = 310;
    const TOGGLE_CLASSES = [
        'ibexa-commerce-comparison__tab-toggler',
        'ibexa-commerce-comparison__delete-list',
        'ibexa-commerce-comparison__tab',
        'ibexa-commerce-comparison__attributes-name',
        'ibexa-commerce-comparison__attributes-value',
    ];
    const toggleTab = (event) => {
        event.preventDefault();
        const { basketId } = event.currentTarget.dataset;

        TOGGLE_CLASSES.forEach((toggleClass) => {
            doc.querySelectorAll(`.${toggleClass}`).forEach((node) => {
                node.classList.remove(`${toggleClass}--active`);
            });
        });

        TOGGLE_CLASSES.forEach((toggleClass) => {
            doc.querySelector(`.${toggleClass}--${basketId}`).classList.add(`${toggleClass}--active`);
        });
    };
    const paginateItems = (event) => {
        let marginLeftAfterAction = 0;
        const tab = event.currentTarget.closest('.ibexa-commerce-comparison__tab');
        const tabWidth = tab.offsetWidth;
        const { direction } = event.currentTarget.dataset;
        const { basketId } = tab.dataset;
        const itemsContainer = tab.querySelector('.ibexa-commerce-comparison__items');
        const technicalItemsContainer = doc.querySelector(`.ibexa-commerce-comparison__attributes-value--${basketId}`);
        const firstItem = tab.querySelector('.ibexa-commerce-comparison__item:first-child');
        const technicalFirstItem = technicalItemsContainer.querySelector('.ibexa-commerce-comparison__attributes-values-group:first-child');
        const items = itemsContainer.querySelectorAll('.ibexa-commerce-comparison__item');
        const { marginLeft } = getComputedStyle(firstItem);
        const parsedMarginLeft = parseInt(marginLeft, 10);
        const itemsWidth = [...items].reduce((sum, item) => (sum += item.offsetWidth), 0);
        const itemsDiffContainerSize = itemsWidth - tabWidth;

        if (direction === 'next') {
            if (Math.abs(parsedMarginLeft) < itemsDiffContainerSize) {
                marginLeftAfterAction = parsedMarginLeft - COMPARISON_ITEM_WIDTH;
            }
        } else {
            if (parsedMarginLeft < 0) {
                marginLeftAfterAction = parsedMarginLeft + COMPARISON_ITEM_WIDTH;
            }
        }

        firstItem.style.marginLeft = `${marginLeftAfterAction}px`;
        technicalFirstItem.style.marginLeft = `${marginLeftAfterAction}px`;
    };

    doc.querySelectorAll('.ibexa-commerce-comparison__tab-toggler').forEach((toggler) => {
        toggler.addEventListener('click', toggleTab, false);
    });

    doc.querySelectorAll('.ibexa-commerce-comparison__icon-button--pagination-button').forEach((toggler) => {
        toggler.addEventListener('click', paginateItems, false);
    });

    TOGGLE_CLASSES.forEach((toggleClass) => {
        const toggleNode = doc.querySelector(`.${toggleClass}`);

        if (toggleNode) {
            toggleNode.classList.add(`${toggleClass}--active`);
        }
    });
})(window, window.document, window.ibexa);
