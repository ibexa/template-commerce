(function (global, doc) {
    const addressField = doc.querySelector('.ibexa-store-address');

    if (!addressField) {
        return;
    }

    const formNode = addressField.querySelector('.ibexa-store-address__fields-wrapper');
    const countrySelect = addressField.querySelector('.ibexa-store-select');
    const handleRequest = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response;
    };
    const getTextFromResponse = (response) => {
        return handleRequest(response).text();
    };
    const getHtmlFromResponse = (response) => {
        const range = doc.createRange();
        const formDOMElement = range.createContextualFragment(response);

        return formDOMElement.querySelector('.ibexa-store-address__fields-wrapper');
    };
    const replaceFormOnCountryChange = (country) => {
        const { contentTypeIdentifier, fieldIdentifier, languageCode, parentLocationId, formName } = formNode.dataset;
        const countryFormLink = `/address/form/${contentTypeIdentifier}/${fieldIdentifier}/${languageCode}/create/${parentLocationId}/name/${formName}/country/${country}`;

        fetch(countryFormLink, { mode: 'same-origin', credentials: 'same-origin' })
            .then(getTextFromResponse)
            .then(getHtmlFromResponse)
            .then((htmlResponse) => {
                formNode.replaceWith(htmlResponse);
            })
            .catch((error) => console.error(error));
    };

    countrySelect.addEventListener(
        'change',
        ({ currentTarget }) => {
            replaceFormOnCountryChange(currentTarget.value);
        },
        false,
    );
})(window, window.document);
