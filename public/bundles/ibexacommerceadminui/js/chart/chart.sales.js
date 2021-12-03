const { LineChart } = window.eZ.core.chart;

export default class SalesChart extends LineChart {
    constructor(data) {
        super(data);

        this.canvas = data.chartWrapper.querySelector('.ibexa-chart__canvas');
    }
}
