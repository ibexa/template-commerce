import OrderStatusChart from './orders.status.chart';

(function (global, doc, ibexa, Translator) {
    const ORDER_COLORS = new Map([
        ['pending', '#FCAE42'],
        ['processing', '#47BEDB'],
        ['completed', '#00A42B'],
        ['cancelled', '#5A5A5D'],
    ]);
    const previewMode = doc.querySelector('.ibexa-db-main-container.ibexa-db-preview');
    const renderOrderStatusCharts = () => {
        const chartsContainer = doc.querySelectorAll('.ibexa-chart.ibexa-chart--orders-status');

        if (!chartsContainer.length) {
            return;
        }

        chartsContainer.forEach((chartContainer) => {
            renderOrderStatusChart(chartContainer);
        });
    };
    const renderOrderStatusChart = (chartContainer) => {
        const { chartData: chartDataRaw } = chartContainer.dataset;
        const chartData = JSON.parse(chartDataRaw);
        const labels = Object.values(chartData).map(({ label }) => label);
        const statuses = Object.values(chartData).map(({ status }) => status);
        const datasetLabel = Translator.trans(/*@Desc("Orders")*/ 'dashboard.orders_status.dataset_label', {}, 'ibexa_dashboard');
        const graphColors = statuses.map((status) => ORDER_COLORS.get(status) || '#FCAE42');
        const data = {
            ref: chartContainer,
            chartName: 'orders-status',
            datasets: [
                {
                    legend: labels,
                    label: ` ${datasetLabel}`,
                    data: Object.values(chartData).map(({ count }) => count),
                    backgroundColor: graphColors,
                },
            ],
            labels,
        };
        const options = { cutout: 180 };
        const chart = new OrderStatusChart(data, options);

        chart.render();
    };

    if (!previewMode) {
        return renderOrderStatusCharts();
    }

    doc.body.addEventListener('ibexa-post-update-blocks-preview', ({ detail }) => {
        const { blockIds } = detail;

        blockIds.forEach((blockId) => {
            const block = doc.querySelector(`[data-ez-block-id="${blockId}"`);
            const chartContainer = block.querySelector('.ibexa-chart.ibexa-chart--orders-status');

            if (!chartContainer) {
                return;
            }

            renderOrderStatusChart(chartContainer);
        });
    });

    window.parent.document.body.addEventListener('ibexa-pb-app-iframe-loaded', () => {
        setTimeout(() => {
            renderOrderStatusCharts();
        }, 0);
    });
})(window, window.document, window.ibexa, window.Translator);
