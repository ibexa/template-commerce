(function (global, doc, ibexa) {
    const { convertDateToTimezone, getBrowserTimezone } = ibexa.helpers.timezone;
    const { timezone: userTimezone } = ibexa.adminUiConfig;
    const permanentDiscountInput = doc.querySelector('.ibexa-dc-wizard-fields__permanent-discount');

    if (!permanentDiscountInput) {
        return;
    }

    const endTimeFormInput = doc.querySelector('.ibexa-dc-wizard-fields__end-time-wrapper');
    const endTimeDatePickerNode = endTimeFormInput.closest('.ibexa-picker').querySelector('.ibexa-date-time-picker');
    const endTimePickerInput = endTimeDatePickerNode.querySelector('.ibexa-date-time-picker__input');
    const endTimeDatePickerInstance = ibexa.helpers.objectInstances.getInstance(endTimeDatePickerNode);
    const endTimeFormGroup = endTimeFormInput.closest('.form-group');
    const endTimeFormError = endTimeFormGroup.querySelector('.ibexa-form-error');
    const isEndTimeInitiallyDisabled = endTimePickerInput.disabled;
    const getEndTimeParams = () => ({
        value: endTimeFormInput.value,
        isInvalid: endTimePickerInput.classList.contains('is-invalid'),
    });
    let endTimeParamsBeforeDisabled = !endTimePickerInput.disabled ? getEndTimeParams() : null;
    const refreshEndTimeDisabledState = () => {
        if (!permanentDiscountInput || !endTimeFormInput || isEndTimeInitiallyDisabled) {
            return;
        }

        endTimePickerInput.disabled = permanentDiscountInput.checked;

        if (endTimePickerInput.disabled) {
            endTimeParamsBeforeDisabled = getEndTimeParams();
            endTimeDatePickerInstance.clear();
            endTimePickerInput.classList.remove('is-invalid');

            if (endTimeFormError) {
                endTimeFormError.hidden = true;
            }
        } else {
            endTimeFormInput.value = endTimeParamsBeforeDisabled.value;
            endTimePickerInput.classList.toggle('is-invalid', endTimeParamsBeforeDisabled.isInvalid);

            if (endTimeFormError) {
                endTimeFormError.hidden = false;
            }

            endTimeParamsBeforeDisabled = null;

            if (endTimeFormInput.value) {
                const date = new Date(endTimeFormInput.value * 1000);
                const dateWithUserTimezone = convertDateToTimezone(date, userTimezone);
                const localTimezone = getBrowserTimezone();
                const convertedDate = convertDateToTimezone(dateWithUserTimezone, localTimezone, true).format();

                endTimeDatePickerInstance.flatpickrInstance.setDate(convertedDate);
            }
        }
    };

    permanentDiscountInput.addEventListener('change', refreshEndTimeDisabledState, false);

    refreshEndTimeDisabledState();
})(window, window.document, window.ibexa);
