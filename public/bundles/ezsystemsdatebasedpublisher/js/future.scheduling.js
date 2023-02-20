(function(global, doc, eZ, flatpickr) {
    const input = doc.querySelector('.dbp-publish-later__pick-input');
    const flatpickrInput = doc.querySelector('.flatpickr-date-input');
    const clearBtn = doc.querySelector('.dbp-publish-later__clear-input-schedule');
    const confirmBtn = doc.querySelector('.ez-btn--confirm-schedule');
    const { convertDateToTimezone, formatShortDateTime } = eZ.helpers.timezone;
    const userTimezone = eZ.adminUiConfig.timezone;
    const updateValue = (dates) => {
        const isDateSelected = !!dates[0];

        if (!isDateSelected) {
            input.dataset.time = '';
            confirmBtn.disabled = true;

            return;
        }

        const selectedDate = dates[0];
        const selectedDateWithUserTimezone = convertDateToTimezone(selectedDate, userTimezone, true);
        const timestamp = Math.floor(selectedDateWithUserTimezone.valueOf() / 1000);

        input.dataset.time = timestamp;
        confirmBtn.disabled = false;
    };
    const submitForm = () => {
        const timestamp = input.dataset.time;

        doc.querySelector('[name="ezplatform_content_forms_content_edit[date_based_publisher][timestamp]"]').value = timestamp;
        doc.querySelector('[name="ezplatform_content_forms_content_edit[schedule_publish]"]').click();
    };
    const onClearBtnClick = (flatpickr, event) => {
        event.preventDefault();

        flatpickr.setDate(null, true);
    };

    if (!confirmBtn) {
        return;
    }

    const userTimezoneCurrentTime = eZ.helpers.timezone.convertDateToTimezone(new Date());
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const minDate = new Date(convertDateToTimezone(userTimezoneCurrentTime, browserTimezone, true));

    const flatpickrInstance = flatpickr(flatpickrInput, {
        enableTime: true,
        time_24hr: true,
        formatDate: (date) => formatShortDateTime(date, null),
        minDate,
        defaultDate: minDate,
        onChange: updateValue,
        inline: true,
        defaultHour: minDate.getHours(),
        defaultMinute: minDate.getMinutes(),
    });

    const setFlatpickrDate = (isMinute, flatpickr, event) => {
        const inputValue = event.target.value;

        if (inputValue.length === 0) {
            return;
        }

        const value = parseInt(inputValue, 10);

        if (typeof value === 'number' && value >= 0) {
            const flatpickrDate = flatpickr.selectedDates[0];

            if (isMinute) {
                flatpickrDate.setMinutes(value);
            } else {
                flatpickrDate.setHours(value);
            }

            if (minDate.getTime() > flatpickrDate.getTime()) {
                return;
            }

            flatpickr.setDate(flatpickrDate, true);
        }
    }

    flatpickrInstance.minuteElement.addEventListener('keyup', setFlatpickrDate.bind(null, true, flatpickrInstance), false);
    flatpickrInstance.hourElement.addEventListener('keyup', setFlatpickrDate.bind(null, false, flatpickrInstance), false);
    clearBtn.addEventListener('click', onClearBtnClick.bind(null, flatpickrInstance), false);
    confirmBtn.addEventListener('click', submitForm, false);
})(window, document, window.eZ, window.flatpickr);
