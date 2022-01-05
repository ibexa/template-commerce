(function(global, doc, ibexa, bootstrap) {
    const showLogButtons = doc.querySelectorAll('.ibexa-btn--show-erp-log');
    const showLog = (logPreviewData) => {
        const modal = doc.querySelector('.ibexa-modal--show-log');
        const logTextNode = modal.querySelector('.ibexa-erp-log__preview--log-text');
        const inputXmlNode = modal.querySelector('.ibexa-erp-log__preview--input-xml');
        const outputHmlNode = modal.querySelector('.ibexa-erp-log__preview--output-xml');

        logTextNode.innerText = JSON.stringify(logPreviewData, null, 4);
        inputXmlNode.innerText = JSON.stringify(logPreviewData.input_xml, null, 4);
        outputHmlNode.innerText = JSON.stringify(logPreviewData.output_xml, null, 4);

        logTextNode
            .closest('.ibexa-erp-log__item')
            .classList.toggle('ibexa-erp-log__item--hidden', logPreviewData.input_xml || logPreviewData.output_xml);
        inputXmlNode.closest('.ibexa-erp-log__item').classList.toggle('ibexa-erp-log__item--hidden', !logPreviewData.input_xml);
        outputHmlNode.closest('.ibexa-erp-log__item').classList.toggle('ibexa-erp-log__item--hidden', !logPreviewData.output_xml);

        bootstrap.Modal.getOrCreateInstance(modal).show();
    };
    const fetchLogPreview = (event) => {
        const id = event.currentTarget.dataset.eventId;
        const url = Routing.generate('siso_admin_erp_ajax', { id });

        fetch(url, { mode: 'same-origin', credentials: 'same-origin' })
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then(showLog)
            .catch(ibexa.helpers.notification.showErrorNotification);
    };

    showLogButtons.forEach((showLogButton) => showLogButton.addEventListener('click', fetchLogPreview, false));
})(window, window.document, window.ibexa, window.bootstrap);
