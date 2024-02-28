(function (global, doc, ibexa, Translator) {
    const form = doc.querySelector('form[name="order_search"]');

    if (!form) {
        return;
    }

    const totalValueInputMin = form.querySelector('.ibexa-om-orders-filters__price-wrapper--min .ibexa-input--text');
    const totalValueInputMax = form.querySelector('.ibexa-om-orders-filters__price-wrapper--max .ibexa-input--text');
    const currencyDropdownNode = form.querySelector('.ibexa-om-orders-filters__currency-wrapper .ibexa-dropdown');
    const currencyDropdownSelect = currencyDropdownNode.querySelector('.ibexa-input');
    const currencyDropdown = currencyDropdownNode.ibexaInstance;
    const clearBtn = form.querySelector('.ibexa-adaptive-filters__clear-btn');
    let wasCurrencyNotificationShowedBefore = false;
    let wasCurrencyInvalidClassAddedBefore = false;
    const checkIsCurrencySelected = () => {
        return currencyDropdown.getSelectedItems()[0].value !== '';
    };
    const focusCurrencyDropdown = () => {
        currencyDropdownSelect.focus();
    };
    const toggleCurrencyDropdownInvalidState = (isInvalid) => {
        currencyDropdownNode.classList.toggle('is-invalid', isInvalid);

        wasCurrencyInvalidClassAddedBefore = wasCurrencyInvalidClassAddedBefore || isInvalid;
    };
    const toggleCurrencyNotification = () => {
        if (wasCurrencyNotificationShowedBefore) {
            return;
        }

        const message = Translator.trans(
            /*@Desc("Select currency to filter by total value.")*/ 'orders.list.filters.no_currency_selected.notification.message',
            {},
            'ibexa_order_management_ui',
        );

        ibexa.helpers.notification.showInfoNotification(message);
        wasCurrencyNotificationShowedBefore = true;
    };
    const checkIsTotalValueWithCurrencyInvalid = () => {
        const isTotalValueFilled = totalValueInputMin.value !== '' || totalValueInputMax.value !== '';
        const isCurrencySelected = checkIsCurrencySelected();

        return isTotalValueFilled && !isCurrencySelected;
    };
    const handleFormSubmit = (event) => {
        const isTotalValueWithCurrencyInvalid = checkIsTotalValueWithCurrencyInvalid();

        if (isTotalValueWithCurrencyInvalid) {
            event.preventDefault();

            toggleCurrencyDropdownInvalidState(true);
            toggleCurrencyNotification();
        }
    };
    const handleFormClear = () => {
        toggleCurrencyDropdownInvalidState(false);
    };
    const handleCurrencyChange = () => {
        const isTotalValueWithCurrencyInvalid = checkIsTotalValueWithCurrencyInvalid();

        toggleCurrencyDropdownInvalidState(isTotalValueWithCurrencyInvalid);
    };
    const handleTotalValueFocus = () => {
        if (!wasCurrencyInvalidClassAddedBefore) {
            return;
        }

        const isTotalValueWithCurrencyInvalid = checkIsTotalValueWithCurrencyInvalid();

        toggleCurrencyDropdownInvalidState(isTotalValueWithCurrencyInvalid);
    };
    const handleTotalValueBlur = () => {
        const isTotalValueFilled = totalValueInputMin.value !== '' || totalValueInputMax.value !== '';

        if (isTotalValueFilled) {
            setTimeout(() => {
                const currentlyFocusedElement = doc.activeElement;
                const isAnyTotalValueInputFocused =
                    currentlyFocusedElement === totalValueInputMin || currentlyFocusedElement === totalValueInputMax;

                if (isAnyTotalValueInputFocused) {
                    return;
                }

                const isCurrencySelected = checkIsCurrencySelected();

                if (!isCurrencySelected) {
                    focusCurrencyDropdown();

                    if (wasCurrencyInvalidClassAddedBefore) {
                        toggleCurrencyDropdownInvalidState(true);
                    }
                }
            });

            return;
        }

        toggleCurrencyDropdownInvalidState(false);
    };

    form.addEventListener('submit', handleFormSubmit, false);
    currencyDropdownSelect.addEventListener('change', handleCurrencyChange, false);
    totalValueInputMin.addEventListener('blur', handleTotalValueBlur, false);
    totalValueInputMax.addEventListener('blur', handleTotalValueBlur, false);
    totalValueInputMin.addEventListener('focus', handleTotalValueFocus, false);
    totalValueInputMax.addEventListener('focus', handleTotalValueFocus, false);
    clearBtn.addEventListener('blur', handleFormClear, false);
})(window, window.document, window.ibexa, window.Translator);
