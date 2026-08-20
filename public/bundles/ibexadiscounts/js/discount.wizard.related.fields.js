(function (global, doc) {
    const relatedFieldsWrappers = doc.querySelectorAll('[data-related-field-selector]');
    const handleRelatedFieldChanged = (relatedField, relatedFieldsWrapper) => {
        relatedFieldsWrapper.classList.toggle('ibexa-dc-wizard-related-fields-wrapper--hidden', !relatedField.checked);
    };

    relatedFieldsWrappers.forEach((relatedFieldsWrapper) => {
        const { relatedFieldSelector } = relatedFieldsWrapper.dataset;
        const relatedField = doc.querySelector(relatedFieldSelector);
        let fieldsToObserve = [];

        if (relatedField.type === 'radio') {
            fieldsToObserve = [...doc.querySelectorAll(`[name="${relatedField.name}"]`)];
        } else {
            fieldsToObserve = [relatedField];
        }

        fieldsToObserve.forEach((fieldToObserve) => {
            fieldToObserve.addEventListener('change', () => {
                handleRelatedFieldChanged(relatedField, relatedFieldsWrapper);
            });
        });
    });
})(window, window.document);
