(function(global, doc, eZ, flatpickr, moment, React, ReactDOM) {
    const udwContainer = doc.getElementById('react-udw');
    const userButton = doc.querySelector('.ibexa-btn--udw-select-user');
    const dateInputs = doc.querySelectorAll('.ibexa-input--date');
    const clearTagBtn = doc.querySelector('#user-breadcrumbs .ibexa-tag__remove-btn');
    const userInput = doc.querySelector('.ibexa-commerce-order-list-filters__input--name');
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const { convertDateToTimezone, formatFullDateTime } = eZ.helpers.timezone;
    const { dateFormat } = eZ.adminUiConfig;
    const userTimezone = eZ.adminUiConfig.timezone;
    const closeUDW = () => ReactDOM.unmountComponentAtNode(udwContainer);
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

        ReactDOM.render(
            React.createElement(
                eZ.modules.UniversalDiscovery,
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
            udwContainer,
        );
    };
    const clearSelection = (btn) => {
        updateBreadcrumbsState('');
        toggleVisibility(btn, false);
    };
    /*
        This function is required because backend needs to get date in format YYYY-MM-DD, so we set it in hidden field with correct name
    */
    const updateValue = function(dates) {
        const isDateSelected = !!dates[0];

        if (!isDateSelected) {
            return;
        }

        const selectedDate = dates[0];
        const selectedDateWithUserTimezone = convertDateToTimezone(selectedDate, userTimezone, true);
        const timestamp = Math.floor(selectedDateWithUserTimezone.valueOf() / 1000);
        const timestampInput = this.input
            .closest('.ibexa-commerce-order-list-filters__item')
            .querySelector('.ibexa-commerce-order-list-filters__timestamp');

        timestampInput.value = moment(timestamp, 'X').format('YYYY-MM-DD');
    };
    const initFlatpickr = (flatpickrInput) => {
        flatpickr(flatpickrInput, {
            enableTime: false,
            formatDate: (date) => formatFullDateTime(date, null, dateFormat.shortDate),
            onChange: updateValue,
        });
    };

    dateInputs.forEach(initFlatpickr);

    if (userButton) {
        userButton.addEventListener('click', openUserUDW, false);
    }

    if (clearTagBtn) {
        clearTagBtn.addEventListener('click', clearSelection.bind(null, userButton), false);
    }
})(window, window.document, window.eZ, window.flatpickr, window.moment, window.React, window.ReactDOM);
