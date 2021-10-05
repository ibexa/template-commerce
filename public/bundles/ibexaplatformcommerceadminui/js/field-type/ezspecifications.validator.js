(function(global, doc, eZ) {
    const SELECTOR_FIELD = '.ibexa-field-edit--ezspecifications';
    const EVENT_VALUE_CHANGED = 'valueChanged';
    class EzSpecificationsValidator extends eZ.BaseFieldValidator {
        validateInput(event) {
            const isRequired = event.target.required;
            const isEmpty = !event.target.value;
            let isEmptyArray = false;
            let isBrokenJSON = false;

            try {
                isEmptyArray = JSON.parse(event.target.value).length === 0;
            } catch (exception) {
                isBrokenJSON = true;
            }

            const isError = ((isEmpty || isEmptyArray) && isRequired) || isBrokenJSON;
            const label = event.target.closest(SELECTOR_FIELD).querySelector('.ibexa-field-edit__label').innerHTML;
            const result = { isError };

            if (isEmpty || isEmptyArray) {
                result.errorMessage = eZ.errors.emptyField.replace('{fieldName}', label);
            } else if (isBrokenJSON) {
                result.errorMessage = eZ.errors.invalidValue.replace('{fieldName}', label);
            }

            return result;
        }
    }
    const validator = new EzSpecificationsValidator({
        classInvalid: 'is-invalid',
        fieldSelector: SELECTOR_FIELD,
        eventsMap: [
            {
                selector: '.ibexa-field-edit--stored-value',
                eventName: EVENT_VALUE_CHANGED,
                callback: 'validateInput',
                errorNodeSelectors: ['.ibexa-form-error'],
            },
        ],
    });

    validator.init();
    eZ.addConfig('fieldTypeValidators', [validator], true);
})(window, window.document, window.eZ);
