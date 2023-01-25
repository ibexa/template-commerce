(function (global, doc) {
    const formSelects = doc.querySelectorAll('.ibexa-store-form .ibexa-store-select');
    const formChoices = doc.querySelectorAll('.ibexa-store-form .ibexa-store-choice input');
    const formTextInputs = doc.querySelectorAll('.ibexa-store-form .ibexa-store-input');
    const filterLabels = doc.querySelectorAll('.ibexa-store-filter__label');
    const submitForm = function () {
        this.form.submit();
    };
    const toggleFilter = ({ currentTarget: filterLabel }) => {
        const filter = filterLabel.closest('.ibexa-store-filter');

        filter.classList.toggle('ibexa-store-filter--collapsed');
    };

    formSelects.forEach((formSelect) => formSelect.addEventListener('change', submitForm, false));
    formChoices.forEach((formChoice) => formChoice.addEventListener('change', submitForm, false));
    formTextInputs.forEach((formTextInput) => formTextInput.addEventListener('change', submitForm, false));
    filterLabels.forEach((filterLabel) => filterLabel.addEventListener('click', toggleFilter, false));
})(window, window.document);
