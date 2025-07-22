(function (global, doc) {
    const ruleTypeSelect = doc.querySelector('.ibexa-dc-extra-actions-rule-type');
    const ruleTypeDropdown = ruleTypeSelect.closest('.ibexa-dropdown');
    const ruleTypeSelectOptions = [...ruleTypeSelect.querySelectorAll('option')];
    const ruleTypeSelectOptionsMap = ruleTypeSelectOptions.reduce((optionsMap, option) => ({ ...optionsMap, [option.value]: option }), {});
    const appliesToElement = doc.querySelector('.ibexa-dc-extra-actions-applies-to');
    const appliesToOptions = appliesToElement.querySelectorAll('.ibexa-dc-extra-actions-applies-to__option');
    const toggleOptionSelection = (option, shouldBeSelected) => {
        option.classList.toggle('ibexa-dc-extra-actions-applies-to__option--selected', shouldBeSelected);
    };
    const getOptionRadio = (option) => option.querySelector('.ibexa-input.ibexa-input--radio');
    const handleOptionChange = (newSelectedOption) => {
        const newSelectedOptionRadio = getOptionRadio(newSelectedOption);

        newSelectedOptionRadio.checked = true;

        appliesToOptions.forEach((option) => {
            const optionRadio = getOptionRadio(option);
            const isSelected = optionRadio.checked;

            toggleOptionSelection(option, isSelected);
        });
    };
    const handleAppliesToChange = () => {
        const selectedRadio = appliesToElement.querySelector('.ibexa-input--radio:checked');

        ruleTypeDropdown.classList.toggle('ibexa-dropdown--disabled', !selectedRadio);
        ruleTypeSelect.innerHTML = '';

        if (!selectedRadio) {
            return;
        }

        const allowedOptions = JSON.parse(selectedRadio.dataset.allowedRuleTypes ?? '[]');

        allowedOptions.forEach((allowedOption) => {
            ruleTypeSelect.appendChild(ruleTypeSelectOptionsMap[allowedOption]);
        });
    };

    handleAppliesToChange();

    appliesToOptions.forEach((appliesToOption) => {
        appliesToOption.addEventListener(
            'click',
            () => {
                handleOptionChange(appliesToOption);
                handleAppliesToChange();
            },
            false,
        );
    });
})(window, window.document);
