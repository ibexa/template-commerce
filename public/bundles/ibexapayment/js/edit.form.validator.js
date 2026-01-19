(function (global, doc, ibexa) {
    const editForm = doc.querySelector('.ibexa-payment-method-edit__form');
    const submitBtn = editForm.querySelector('.ibexa-payment-method-edit__submit-btn');
    const inputsToValidate = [...editForm.querySelectorAll('.ibexa-input[required]')];
    const scrollToInvalidInput = () => {
        const firstInvalidInput = editForm.querySelector('.ibexa-input.is-invalid');

        firstInvalidInput?.focus();
    };
    const validateField = (input) => {
        const field = input.closest('.form-group');

        return ibexa.helpers.formValidation.validateIsEmptyField(field);
    };
    const validateForm = (event) => {
        event.preventDefault();

        const isFormValid = inputsToValidate.map(validateField).every(({ isValid }) => isValid);

        if (isFormValid) {
            editForm.submit();
        } else {
            scrollToInvalidInput();
        }
    };
    const attachTriggerToValidateFields = () => {
        inputsToValidate.forEach((input) => {
            if (input.tagName.toLowerCase() === 'select') {
                input.addEventListener('change', () => validateField(input), false);
            } else {
                input.addEventListener('blur', () => validateField(input), false);
            }
        });
    };

    attachTriggerToValidateFields();
    submitBtn.addEventListener('click', validateForm, false);
})(window, window.document, window.ibexa);
