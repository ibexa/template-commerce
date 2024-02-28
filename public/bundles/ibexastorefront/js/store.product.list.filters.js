(function (global, doc, localStorage) {
    const formSelects = doc.querySelectorAll('.ibexa-store-form .ibexa-store-select');
    const formChoices = doc.querySelectorAll('.ibexa-store-form .ibexa-store-choice input');
    const formTextInputs = doc.querySelectorAll('.ibexa-store-form .ibexa-store-input');
    const filterLabels = doc.querySelectorAll('.ibexa-store-filter__label');
    const moreBtnsElements = doc.querySelectorAll('.ibexa-store-filters .ibexa-store-filter__more-btn');
    const IBEXA_STORE_FILTERS_MORE_BTNS_STATE = 'ibexa-store-filters-more-btns-state';
    const submitForm = function () {
        this.form.submit();
    };
    const submitOnClear = function (event) {
        const isClearBtnClickEvent = event instanceof InputEvent;

        if (isClearBtnClickEvent) {
            return;
        }

        submitForm.call(this);
    };
    const toggleFilter = ({ currentTarget: filterLabel }) => {
        const filter = filterLabel.closest('.ibexa-store-filter');

        filter.classList.toggle('ibexa-store-filter--collapsed');
    };
    const getMoreBtns = () => {
        const data = JSON.parse(localStorage.getItem(IBEXA_STORE_FILTERS_MORE_BTNS_STATE)) ?? [];

        return data;
    };
    const setMoreBtns = (data) => {
        localStorage.setItem(IBEXA_STORE_FILTERS_MORE_BTNS_STATE, JSON.stringify(data));
    };
    const changeMoreBtnLabel = (moreBtn, isExpanded) => {
        const { showMore, showLess } = moreBtn.dataset;

        if (isExpanded) {
            moreBtn.innerHTML = showLess;
        } else {
            moreBtn.innerHTML = showMore;
        }
    };
    const toggleCheckboxVisibility = (moreBtn, isExpanded) => {
        const filterContainer = moreBtn.closest('.ibexa-store-filter');
        const filterChoices = filterContainer.querySelectorAll('.ibexa-store-choice.ibexa-store-choice--more');

        filterChoices.forEach((filterChoice) => filterChoice.classList.toggle('ibexa-store-choice--hidden', !isExpanded));
    };
    const moreBtnToggle = ({ currentTarget }) => {
        const moreBtns = getMoreBtns();
        const filterTitleName = currentTarget.dataset.typeName;
        const moreBtnIndex = moreBtns.findIndex(({ type }) => type === filterTitleName);

        if (moreBtnIndex >= 0) {
            moreBtns[moreBtnIndex].isExpanded = !moreBtns[moreBtnIndex].isExpanded;
        } else {
            moreBtns.push({ type: filterTitleName, isExpanded: true });
        }

        setMoreBtns(moreBtns);

        const isExpanded = moreBtnIndex !== -1 ? moreBtns[moreBtnIndex].isExpanded : true;

        toggleCheckboxVisibility(currentTarget, isExpanded);
        changeMoreBtnLabel(currentTarget, isExpanded);
    };
    const initMoreBtn = (moreBtn) => {
        const moreBtns = getMoreBtns();
        const filterTitleName = moreBtn.dataset.typeName;
        const moreBtnIndex = moreBtns.findIndex(({ type }) => type === filterTitleName);

        if (moreBtnIndex === -1) {
            return;
        }

        const { isExpanded } = moreBtns[moreBtnIndex];

        toggleCheckboxVisibility(moreBtn, isExpanded);
        changeMoreBtnLabel(moreBtn, isExpanded);
    };

    formSelects.forEach((formSelect) => formSelect.addEventListener('change', submitForm, false));
    formChoices.forEach((formChoice) => formChoice.addEventListener('change', submitForm, false));
    formTextInputs.forEach((formTextInput) => {
        formTextInput.addEventListener('change', submitForm, false);
        formTextInput.addEventListener('input', submitOnClear, false);
    });
    filterLabels.forEach((filterLabel) => filterLabel.addEventListener('click', toggleFilter, false));
    moreBtnsElements.forEach((moreBtnElement) => {
        moreBtnElement.addEventListener('click', moreBtnToggle, false);
        initMoreBtn(moreBtnElement);
    });
})(window, window.document, window.localStorage);
