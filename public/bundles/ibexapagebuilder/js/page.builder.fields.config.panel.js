(function(global, doc, ibexa) {
    const fieldsConfigPanel = doc.querySelector('.ibexa-pb-fields-config-panel');
    const fieldsConfigPanelTogglerBtn = doc.querySelector('.ibexa-btn--show-fields');
    const isFieldsConfigPanelOpenedAtStartup = fieldsConfigPanelTogglerBtn.classList.contains('ibexa-btn--selected');
    const openConfigPanel = () => {
        fieldsConfigPanelTogglerBtn.classList.toggle('ibexa-btn--selected');
        fieldsConfigPanel.classList.toggle('ibexa-pb-config-panel--closed');

        return true;
    };
    const closeConfigPanel = () => {
        fieldsConfigPanel.classList.add('ibexa-pb-config-panel--closed');
        fieldsConfigPanelTogglerBtn.classList.remove('ibexa-btn--selected');

        return true;
    };
    const toggleFieldsConfigPanel = () => {
        const isConfigPanelClosed = fieldsConfigPanel.classList.contains('ibexa-pb-config-panel--closed');

        if (isConfigPanelClosed) {
            const wasConfigPanelOpened = doc.dispatchEvent(
                new CustomEvent('ibexa-pb-config-panel-open', {
                    cancelable: true,
                    detail: { settings: { onOpen: openConfigPanel, onClose: closeConfigPanel } },
                })
            );

            if (wasConfigPanelOpened) {
                ibexa.helpers.tooltips.hideAll();
            }
        } else {
            doc.dispatchEvent(new CustomEvent('ibexa-pb-config-panel-close-itself'));
            closeConfigPanel();
        }

        fieldsConfigPanelTogglerBtn.classList.remove('ibexa-btn--error');
    };

    fieldsConfigPanelTogglerBtn.addEventListener('click', toggleFieldsConfigPanel, false);

    if (isFieldsConfigPanelOpenedAtStartup) {
        doc.dispatchEvent(
            new CustomEvent('ibexa-pb-config-panel-open', {
                cancelable: true,
                detail: { settings: { onOpen: () => {}, onClose: closeConfigPanel, onAbort: closeConfigPanel } },
            })
        );
    }

    doc.body.addEventListener(
        'ibexa-form-builder:before-open',
        () => {
            fieldsConfigPanel.classList.add('ibexa-pb-fields-config-panel--full-screen-field-opened');
        },
        false
    );
    doc.body.addEventListener(
        'ibexa-form-builder:before-close',
        () => {
            fieldsConfigPanel.classList.remove('ibexa-pb-fields-config-panel--full-screen-field-opened');
        },
        false
    );
    doc.body.addEventListener(
        'ibexa-pb:validation:other-field-types',
        (event) => {
            const { isValid } = event.detail;

            fieldsConfigPanelTogglerBtn.classList.toggle('ibexa-btn--error', !isValid);
        },
        false
    );
})(window, window.document, window.ibexa);
