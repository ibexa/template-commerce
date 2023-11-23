import OrderStatusChart from './orders.status.chart';

(function (global, doc, ibexa, Translator) {
    const chartContainer = doc.querySelector('.ibexa-chart.ibexa-chart--orders-status');

    if (!chartContainer) {
        return;
    }

    const graphColors = ibexa.adminUiConfig.chartColorPalette;
    const { chartData: chartDataRaw } = chartContainer.dataset;
    const chartData = JSON.parse(chartDataRaw);
    const labels = Object.values(chartData).map(({ status }) => status);
    const datasetLabel = Translator.trans(/*@Desc("Orders")*/ 'dashboard.orders_status.dataset_label', {}, 'ibexa_dashboard');
    const data = {
        chartName: 'orders-status',
        datasets: [
            {
                legend: labels,
                label: datasetLabel,
                data: Object.values(chartData).map(({ count }) => count),
                backgroundColor: graphColors,
            },
        ],
        labels,
    };
    const options = { cutout: 180 };
    const chart = new OrderStatusChart(data, options);

    chart.render();
})(window, window.document, window.ibexa, window.Translator);
