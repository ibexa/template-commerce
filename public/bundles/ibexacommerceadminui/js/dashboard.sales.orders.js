import SalesChart from './chart/chart.sales';
import OrdersChart from './chart/chart.orders';
import PredefinedDateSetter from './helpers/predefined.dates.setter.js';

const SALES_CHART = 'sales';
const ORDERS_CHART = 'orders';
const BEST_CLIENTS_TABLE = 'bestclients';
const LAST_ORDERS_TABLE = 'lastorders';
const SHOP_ID = 'MAIN';

(function(global, doc, ibexa, flatpickr, moment) {
    const { convertDateToTimezone, formatShortDateTime } = ibexa.helpers.timezone;
    const userTimezone = ibexa.adminUiConfig.timezone;
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const currencySelect = doc.querySelector('select[name="currency"]');
    const limitSelect = doc.querySelector('select[name="limit"]');
    const dateInputs = doc.querySelectorAll('.ibexa-commerce-filters__date-select');
    const dateStartInput = doc.querySelector('.ibexa-commerce-filters__date-select--start');
    const dateEndInput = doc.querySelector('.ibexa-commerce-filters__date-select--end');
    const dateRangeDropdownContainer = doc.querySelector('.ibexa-dropdown--date-range');
    const predefinedDateSetter = new PredefinedDateSetter(dateStartInput, dateEndInput);
    const charts = {};
    const setDates = () => {
        const selectedRange = limitSelect.value;
        const isSelectedCustomRange = selectedRange === 'custom_range';

        dateStartInput.dataset.jsChanged = 1;
        dateEndInput.dataset.jsChanged = 1;
        predefinedDateSetter.setDates(selectedRange);
        dateStartInput
            .closest('.ibexa-commerce-filters__filter')
            .classList.toggle('ibexa-commerce-filters__filter--hidden', !isSelectedCustomRange);
        dateEndInput
            .closest('.ibexa-commerce-filters__filter')
            .classList.toggle('ibexa-commerce-filters__filter--hidden', !isSelectedCustomRange);
    };
    const getChartData = (chartType, dashboardChartsRequestCallback) => {
        const startDateWithUserTimezone = convertDateToTimezone(
            dateStartInput.closest('.ibexa-commerce-filters__filter').querySelector('.ibexa-date-server').value,
            userTimezone,
            true,
        );
        const startDateTimestamp = Math.floor(startDateWithUserTimezone.valueOf() / 1000);
        const startDate = moment(startDateTimestamp, 'X').format('DD-MM-YYYY');
        const endDateWithUserTimezone = convertDateToTimezone(
            dateEndInput.closest('.ibexa-commerce-filters__filter').querySelector('.ibexa-date-server').value,
            userTimezone,
            true,
        );
        const endDateTimestamp = Math.floor(endDateWithUserTimezone.valueOf() / 1000);
        const endDate = moment(endDateTimestamp, 'X').format('DD-MM-YYYY');

        const request = new Request('/api/ibexa/v2/rest/dashboard-charts', {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.ibexa.api.dashboardData+json',
                'Content-Type': 'application/vnd.chart.Data+json',
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            body: JSON.stringify({
                get_tab_data: [
                    {
                        range: [startDate, endDate],
                        wrapper: '#main-chart',
                        module: chartType,
                        title: chartType,
                        type: 'dashboard',
                        trends: 0,
                        shopId: SHOP_ID,
                        currency: currencySelect.value,
                        userId: 'all',
                        partyId: 'all',
                    },
                ],
            }),
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then(dashboardChartsRequestCallback)
            .catch(ibexa.helpers.notification.showErrorNotification);
    };
    const getTableData = (type, dashboardTablesRequestCallback) => {
        const request = new Request('/api/ibexa/v2/rest/dashboard-bestseller', {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.ibexa.api.dashboardData+json',
                'Content-Type': 'application/vnd.chart.Data+json',
                'X-Siteaccess': siteaccess,
                'X-CSRF-Token': token,
            },
            body: JSON.stringify({
                get_tab_data: [
                    {
                        type,
                        panel: 'tabs',
                        trends: 0,
                        shopId: SHOP_ID,
                        currency: currencySelect.value,
                        userId: 'all',
                    },
                ],
            }),
            mode: 'same-origin',
            credentials: 'same-origin',
        });

        fetch(request)
            .then(ibexa.helpers.request.getJsonFromResponse)
            .then(dashboardTablesRequestCallback)
            .catch(ibexa.helpers.notification.showErrorNotification);
    };
    const updateSalesChart = (response) => {
        if (!response.data.dashboardData) {
            return false;
        }

        const chartData = JSON.parse(response.data.dashboardData);
        const chartWrapper = doc.querySelector('.ibexa-commerce-dashboard-charts__chart-wrapper--sales');
        const timeLimitLabel = chartWrapper.querySelector('.ibexa-chart__time-range');
        const selectedOption = limitSelect.querySelector('option:checked');
        const timeLimitValue = selectedOption.innerHTML;
        const chartFooterNode = chartWrapper.querySelector('.ibexa-commerce-dashboard-chart-footer');
        const chartFooterValueNode = chartFooterNode.querySelector('.ibexa-commerce-dashboard-chart-footer__value');

        if (charts[SALES_CHART]) {
            charts[SALES_CHART].setData(chartData);
            charts[SALES_CHART].updateChart();
        } else {
            charts[SALES_CHART] = new SalesChart({
                ...chartData,
                ...{ chartWrapper },
            });
            charts[SALES_CHART].render();
        }

        timeLimitLabel.innerHTML = timeLimitValue;
        chartFooterNode.classList.toggle('ibexa-commerce-dashboard-chart-footer--hidden', !chartData.summary);

        if (chartData.summary) {
            chartFooterValueNode.innerHTML = chartData.summary;
        }
    };
    const updateOrdersChart = (response) => {
        if (!response.data.dashboardData) {
            return false;
        }

        const chartData = JSON.parse(response.data.dashboardData);
        const chartWrapper = doc.querySelector('.ibexa-commerce-dashboard-charts__chart-wrapper--orders');
        const timeLimitLabel = chartWrapper.querySelector('.ibexa-chart__time-range');
        const selectedOption = limitSelect.querySelector('option:checked');
        const timeLimitValue = selectedOption.innerHTML;
        const chartFooterNode = chartWrapper.querySelector('.ibexa-commerce-dashboard-chart-footer');
        const chartFooterValueNode = chartFooterNode.querySelector('.ibexa-commerce-dashboard-chart-footer__value');

        if (charts[ORDERS_CHART]) {
            charts[ORDERS_CHART].setData(chartData);
            charts[ORDERS_CHART].updateChart();
        } else {
            charts[ORDERS_CHART] = new OrdersChart({
                ...chartData,
                ...{ chartWrapper },
            });
            charts[ORDERS_CHART].render();
        }

        timeLimitLabel.innerHTML = timeLimitValue;
        chartFooterNode.classList.toggle('ibexa-commerce-dashboard-chart-footer--hidden', !chartData.summary);

        if (chartData.summary) {
            chartFooterValueNode.innerHTML = chartData.summary;
        }
    };
    const updateBestClientsTable = (response) => {
        if (!response.data.dashboardData.content) {
            return;
        }

        const tableRows = Object.values(response.data.dashboardData.content.dataTable);
        const tableWrapper = doc.querySelector('.ibexa-commerce-dashboard-table--best-clients');
        const { template } = tableWrapper.dataset;
        const tableBody = tableWrapper.querySelector('tbody');

        tableBody.textContent = '';
        tableRows.forEach((row) => {
            const filledRow = template
                .replace('{{ name }}', row.name)
                .replace('{{ amount }}', row.amount)
                .replace('{{ currency }}', row.currency);

            tableBody.insertAdjacentHTML('beforeend', filledRow);
        });
    };
    const updateLastOrdersTable = (response) => {
        if (!response.data.dashboardData.content) {
            return;
        }

        const tableRows = Object.values(response.data.dashboardData.content.dataTable);
        const tableWrapper = doc.querySelector('.ibexa-commerce-dashboard-table--last-orders');
        const { template } = tableWrapper.dataset;
        const tableBody = tableWrapper.querySelector('tbody');

        tableBody.textContent = '';
        tableRows.forEach((row) => {
            const filledRow = template
                .replace('{{ date }}', row.date)
                .replace('{{ buyer }}', row.buyer)
                .replace('{{ total }}', row.total)
                .replace('{{ currency }}', row.currency);

            tableBody.insertAdjacentHTML('beforeend', filledRow);
        });
    };
    const updateTables = () => {
        if (parseInt(dateStartInput.dataset.omitNextRequest)) {
            dateStartInput.dataset.omitNextRequest = 0;

            return;
        }

        if (!currencySelect.value) {
            return;
        }

        getTableData(LAST_ORDERS_TABLE, updateLastOrdersTable);
        getTableData(BEST_CLIENTS_TABLE, updateBestClientsTable);
    };
    const updateCharts = () => {
        if (parseInt(dateStartInput.dataset.omitNextRequest)) {
            dateStartInput.dataset.omitNextRequest = 0;

            return;
        }

        if (!currencySelect.value || !dateStartInput.value || !dateEndInput.value) {
            return;
        }

        getChartData(SALES_CHART, updateSalesChart);
        getChartData(ORDERS_CHART, updateOrdersChart);
    };
    const updateFlatpickrValue = function(dates) {
        const isDateSelected = !!dates[0];

        if (!isDateSelected) {
            return;
        }

        const selectedDate = dates[0];
        const selectedDateWithUserTimezone = convertDateToTimezone(selectedDate, userTimezone, true);
        const timestamp = Math.floor(selectedDateWithUserTimezone.valueOf() / 1000);
        const formattedDate = moment(timestamp, 'X').format('YYYY-MM-DD');

        this.input.closest('.ibexa-commerce-filters__filter').querySelector('.ibexa-date-server').value = formattedDate;

        if (parseInt(this.input.dataset.jsChanged, 10)) {
            this.input.dataset.jsChanged = 0;
        } else {
            limitSelect.value = 'custom_range';
        }
    };
    const initDropdown = (container) => {
        const sourceSelect = container.querySelector('.ibexa-dropdown__source .ibexa-input--select');
        const dropdown = new ibexa.core.Dropdown({ container });

        sourceSelect.dispatchEvent(new Event('change'));
        dropdown.init();
    };
    const initFlatpickr = (flatpickrInput) => {
        flatpickr(flatpickrInput, {
            enableTime: false,
            formatDate: (date) => formatShortDateTime(date, null),
            onChange: updateFlatpickrValue,
        });
    };

    currencySelect.addEventListener(
        'change',
        () => {
            updateCharts();
            updateTables();
        },
        false,
    );
    dateStartInput.addEventListener('change', updateCharts, false);
    dateEndInput.addEventListener('change', updateCharts, false);
    limitSelect.addEventListener('change', setDates, false);
    dateInputs.forEach(initFlatpickr);

    setDates();
    updateCharts();
    updateTables();
    initDropdown(dateRangeDropdownContainer);
})(window, window.document, window.ibexa, window.flatpickr, window.moment);
