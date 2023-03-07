(function (global, doc, ibexa, moment, React, ReactDOM) {
    const udwContainer = doc.getElementById('react-udw');
    const userButton = doc.querySelector('.ibexa-btn--udw-select-user');
    const dateContainer = doc.querySelectorAll('.ibexa-commerce-order-list-filters__item--date');
    const clearTagBtn = doc.querySelector('#user-breadcrumbs .ibexa-tag__remove-btn');
    const userInput = doc.querySelector('.ibexa-commerce-order-list-filters__input--name');
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const { formatShortDateTime } = ibexa.helpers.timezone;
    const { shortDate } = ibexa.adminUiConfig.dateFormat;
    let udwRoot = null;
    const closeUDW = () => udwRoot.unmount();
    const toggleVisibility = (btn, isLocationSelected) => {
        const contentBreadcrumbsWrapper = doc.getElementById('user-breadcrumbs');

        btn.hidden = isLocationSelected;

        if (contentBreadcrumbsWrapper) {
            contentBreadcrumbsWrapper.hidden = !isLocationSelected;
        }
    };
    const updateBreadcrumbsState = (userId) => {
        const contentBreadcrumbsContainer = doc.getElementById('user-breadcrumbs');
        const contentBreadcrumbs = contentBreadcrumbsContainer.querySelector('.ibexa-tag__content');

        userInput.value = userId;
        contentBreadcrumbs.innerText = userId;
    };
    const onConfirm = (btn, items) => {
        closeUDW();

        const { id } = items[0];

        updateBreadcrumbsState(id);
        toggleVisibility(btn, !!id);
    };
    const onCancel = () => closeUDW();
    const openUserUDW = (event) => {
        event.preventDefault();

        const config = JSON.parse(event.currentTarget.dataset.udwConfig);

        udwRoot = ReactDOM.createRoot(udwContainer);
        udwRoot.render(
            React.createElement(
                ibexa.modules.UniversalDiscovery,
                Object.assign(
                    {
                        onConfirm: onConfirm.bind(null, event.currentTarget),
                        onCancel,
                        title: event.currentTarget.dataset.universalDiscoveryTitle,
                        restInfo: {
                            token,
                            siteaccess,
                        },
                    },
                    config,
                ),
            ),
        );
    };
    const clearSelection = (btn) => {
        updateBreadcrumbsState('');
        toggleVisibility(btn, false);
    };
    const pickerConfig = {
        enableTime: false,
        formatDate: (date) => formatShortDateTime(date, null, shortDate),
    };
    /*
        This function is required because backend needs to get date in format YYYY-MM-DD, so we set it in hidden field with correct name
    */
    const updateInputValue = (timestamps, { inputField }) => {
        const timestampInput = inputField
            .closest('.ibexa-commerce-order-list-filters__item')
            .querySelector('.ibexa-commerce-order-list-filters__timestamp');
        const timestamp = timestamps[0];

        if (!timestamp) {
            timestampInput.value = '';
        } else {
            timestampInput.value = moment(timestamp, 'X').format('YYYY-MM-DD');
        }
    };
    const initDateTimePicker = (field) => {
        const dateTimePickerWidget = new ibexa.core.DateTimePicker({
            container: field,
            onChange: updateInputValue,
            flatpickrConfig: { ...pickerConfig },
        });

        dateTimePickerWidget.init();
    };

    dateContainer.forEach(initDateTimePicker);

    if (userButton) {
        userButton.addEventListener('click', openUserUDW, false);
    }

    if (clearTagBtn) {
        clearTagBtn.addEventListener('click', clearSelection.bind(null, userButton), false);
    }
})(window, window.document, window.ibexa, window.moment, window.React, window.ReactDOM);
