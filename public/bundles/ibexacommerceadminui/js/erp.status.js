(function(global, doc, ibexa, Routing) {
    const fetchStatus = () => {
        const token = doc.querySelector('meta[name="CSRF-Token"]').content;
        const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
        const request = new Request('/api/ezp/v2/rest/dashboard-overview', {
            method: 'POST',
            body: JSON.stringify({
                get_overview_data: [
                    {
                        type: 'dashboard',
                        trends: 0,
                        shopId: 'MAIN',
                    },
                ],
            }),
            headers: {
                'X-CSRF-Token': token,
                'X-Siteaccess': siteaccess,
                'Content-Type': 'application/vnd.chart.Data+json',
                Accept: 'application/vnd.ez.api.dashboardData+json',
            },
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then((response) => {
                const isConnected = response.data.dashboardData.erpStatus;
                const statusCheckingNode = doc.querySelector('.ibexa-erp-overview__status-checking');
                const statusFineNode = doc.querySelector('.ibexa-erp-overview__status-fine');
                const statusNoConnectionNode = doc.querySelector('.ibexa-erp-overview__status-no-connection');

                statusCheckingNode.classList.add('ibexa-erp-overview__status-checking--hidden');
                statusFineNode.classList.toggle('ibexa-erp-overview__status-fine--hidden', !isConnected);
                statusNoConnectionNode.classList.toggle('ibexa-erp-overview__status-no-connection--hidden', isConnected);
            })
            .catch(ibexa.helpers.notification.showErrorNotification);
    };

    if (!doc.querySelector('.ibexa-erp-overview')) {
        return;
    }

    fetchStatus();
})(window, window.document, window.ibexa, window.Routing);
