(function(global, doc, eZ) {
    const COMPARISON_ITEM_WIDTH = 310;
    const TOGGLE_CLASSES = [
        'ezcommerce-comparison__tab-toggler',
        'ezcommerce-comparison__delete-list',
        'ezcommerce-comparison__tab',
        'ezcommerce-comparison__attributes-name',
        'ezcommerce-comparison__attributes-value',
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
        const tab = event.currentTarget.closest('.ezcommerce-comparison__tab');
        const tabWidth = tab.offsetWidth;
        const { direction } = event.currentTarget.dataset;
        const { basketId } = tab.dataset;
        const itemsContainer = tab.querySelector('.ezcommerce-comparison__items');
        const technicalItemsContainer = doc.querySelector(`.ezcommerce-comparison__attributes-value--${basketId}`);
        const firstItem = tab.querySelector('.ezcommerce-comparison__item:first-child');
        const technicalFirstItem = technicalItemsContainer.querySelector('.ezcommerce-comparison__attributes-values-group:first-child');
        const items = itemsContainer.querySelectorAll('.ezcommerce-comparison__item');
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

    doc.querySelectorAll('.ezcommerce-comparison__tab-toggler').forEach((toggler) => {
        toggler.addEventListener('click', toggleTab, false);
    });

    doc.querySelectorAll('.ezcommerce-comparison__icon-button--pagination-button').forEach((toggler) => {
        toggler.addEventListener('click', paginateItems, false);
    });

    TOGGLE_CLASSES.forEach((toggleClass) => {
        const toggleNode = doc.querySelector(`.${toggleClass}`);

        if (toggleNode) {
            toggleNode.classList.add(`${toggleClass}--active`);
        }
    });
})(window, window.document, window.eZ);
