(function(global, doc, ibexa, flatpickr, React, ReactDOM, Translator) {
    const dateBtns = doc.querySelectorAll('.ibexa-filters__input--date');
    const openUdwButtons = doc.querySelectorAll('.ibexa-filters__item-udw-button');
    const resetButtons = doc.querySelectorAll('.ibexa-filters__btn-reset');
    const udwContainer = doc.querySelector('#react-udw');
    const updateInputValue = (btn, dates) => {
        const input = doc.querySelector(btn.dataset.targetSelector);
        const date = dates[0];
        const dateWithUserTimezone = ibexa.helpers.timezone.convertDateToTimezone(date, ibexa.adminUiConfig.timezone, true);
        const dateTimestamp = Math.floor(dateWithUserTimezone.valueOf() / 1000);
        const formattedDate = moment(dateTimestamp, 'X').format('YYYY-MM-DD');

        input.value = formattedDate;
    };
    const resetUserId = (event) => {
        const filterItem = event.target.closest('.ibexa-filters__item');
        const btn = filterItem.querySelector('.ibexa-filters__item-udw-button');
        const input = filterItem.querySelector('input');
        const itemDesc = filterItem.querySelector('.ibexa-filters__item-desc');
        const userIdNode = filterItem.querySelector('.ibexa-filters__user-id');

        event.currentTarget.classList.remove('ibexa-filters__item-button--hidden');
        itemDesc.classList.add('ibexa-filters__item-desc--hidden');

        input.value = '';
        userIdNode.innerHTML = '';

        btn.classList.remove('ibexa-filters__item-button--hidden');
        itemDesc.classList.add('ibexa-filters__item-desc--hidden');
    };
    const initFlatPickr = (dateBtn) => {
        const defaultDate = new Date(dateBtn.value);

        flatpickr(dateBtn, {
            onChange: updateInputValue.bind(null, dateBtn),
            defaultDate,
        });
    };
    const closeUDW = () => ReactDOM.unmountComponentAtNode(udwContainer);
    const onConfirm = (btn, items) => {
        const filterItem = btn.closest('.ibexa-filters__item');
        const input = filterItem.querySelector('input');
        const itemDesc = filterItem.querySelector('.ibexa-filters__item-desc');
        const userIdNode = filterItem.querySelector('.ibexa-filters__user-id');
        const userId = items[0].ContentInfo.Content._id;

        closeUDW();

        input.value = userId;
        userIdNode.innerHTML = userId;

        btn.classList.add('ibexa-filters__item-button--hidden');
        itemDesc.classList.remove('ibexa-filters__item-desc--hidden');
    };
    const onCancel = () => closeUDW();
    const openUdw = (event) => {
        const config = JSON.parse(event.currentTarget.dataset.udwConfig);
        const title = Translator.trans(/*@Desc("Select user")*/ 'filters.select_user', {}, 'filters_ui');

        ReactDOM.render(
            React.createElement(ibexa.modules.UniversalDiscovery, {
                onConfirm: onConfirm.bind(null, event.currentTarget),
                onCancel,
                title,
                ...config,
            }),
            udwContainer
        );
    };

    dateBtns.forEach(initFlatPickr);
    resetButtons.forEach((resetButton) => resetButton.addEventListener('click', resetUserId, false));
    openUdwButtons.forEach((openUdwButton) => openUdwButton.addEventListener('click', openUdw, false));
})(window, window.document, window.ibexa, window.flatpickr, window.React, window.ReactDOM, window.Translator);
