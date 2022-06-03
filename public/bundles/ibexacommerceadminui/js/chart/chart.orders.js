const { BarChart } = window.ibexa.core.chart;
const chartOptions = {
    scales: {
        yAxes: [
            {
                ticks: {
                    precision: 0,
                    beginAtZero: true,
                },
            },
        ],
        xAxes: [
            {
                display: true,
                gridLines: {
                    display: false,
                },
            },
        ],
    },
};

export default class OrdersChart extends BarChart {
    constructor(data) {
        super(data, chartOptions);

        this.canvas = data.chartWrapper.querySelector('.ibexa-chart__canvas');
    }
}
