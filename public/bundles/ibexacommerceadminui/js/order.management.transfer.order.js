(function(global, doc, ibexa) {
    const transferButtons = doc.querySelectorAll('.ibexa-btn--transfer');
    const transferOrder = (event) => {
        const token = doc.querySelector('meta[name="CSRF-Token"]').content;
        const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
        const request = new Request(`/api/ibexa/v2/rest/lostorders/erp-transfer/${event.currentTarget.dataset.id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.ibexa.api.LostOrdersData+json',
                'Content-Type': 'application/vnd.ibexa.api.LostOrdersData+json',
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then((response) => {
                const data = response.data.messages;
                const showNotification = data.status
                    ? ibexa.helpers.notification.showSuccessNotification
                    : ibexa.helpers.notification.showErrorNotification;

                Object.values(data.messages).forEach(showNotification);
            })
            .catch(ibexa.helpers.notification.showErrorNotification);
    };

    transferButtons.forEach((button) => button.addEventListener('click', transferOrder, false));
})(window, window.document, window.ibexa);
