(function(global, doc, ibexa) {
    const deleteButtons = doc.querySelectorAll('.ibexa-btn--trash');
    const deleteOrder = (event) => {
        const token = doc.querySelector('meta[name="CSRF-Token"]').content;
        const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
        const request = new Request(`/api/ibexa/v2/rest/lostorders/remove-lostorder/${event.currentTarget.dataset.id}`, {
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

    deleteButtons.forEach((button) => button.addEventListener('click', deleteOrder, false));
})(window, window.document, window.ibexa);
