(function (global, doc) {
    const containers = doc.querySelectorAll('.ibexa-adaptive-filters');

    containers.forEach((container) => {
        const clearBtn = container.querySelector('.ibexa-adaptive-filters__clear-btn');
        const applyBtn = container.querySelector('.ibexa-adaptive-filters__submit-btn');
        const dropdownNodes = [...container.querySelectorAll('.ibexa-dropdown')];
        const textInputNodes = [...container.querySelectorAll('.ibexa-input--text')];
        const datePickerNodes = [...container.querySelectorAll('.ibexa-picker')];
        const originalValuesMap = new Map();
        const dropdownSelectionsEqual = (selection1, selection2) => {
            if (selection1.length !== selection2.length) {
                return false;
            }

            for (let i = 0; i < selection1.length; ++i) {
                if (selection1[i] !== selection2[i]) return false;
            }

            return true;
        };
        const checkFieldsValuesChanged = () => {
            const checkIsTextInputValueChanged = (textInputNode) => {
                const { value } = textInputNode;
                const originalValue = originalValuesMap.get(textInputNode);

                return value !== originalValue;
            };
            const checkIsDropdownValueChanged = (dropdownNode) => {
                const dropdown = dropdownNode.ibexaInstance;
                const value = [...dropdown.getSelectedItems()].map((item) => item.value);
                const originalValue = originalValuesMap.get(dropdown);

                return !dropdownSelectionsEqual(value, originalValue);
            };
            const checkIsDatePickerValueChanged = (datePickerNode) => {
                const datePickerInput = datePickerNode.querySelector('.ibexa-picker__input');
                const value = datePickerInput.dataset.timestamp ?? '';
                const originalValue = originalValuesMap.get(datePickerNode);

                return value !== originalValue;
            };

            return (
                textInputNodes.some(checkIsTextInputValueChanged) ||
                dropdownNodes.some(checkIsDropdownValueChanged) ||
                datePickerNodes.some(checkIsDatePickerValueChanged)
            );
        };
        const checkAreFiltersCleared = () => {
            const checkIsDropdownCleared = (dropdownNode) => {
                const isDisabled = dropdownNode.classList.contains('ibexa-dropdown--disabled');
                const selectNode = dropdownNode.querySelector('.ibexa-input--select');
                const dropdown = dropdownNode.ibexaInstance;

                return isDisabled || (dropdown.canSelectOnlyOne ? selectNode.selectedIndex === 0 : selectNode.selectedIndex === -1);
            };
            const checkIsTextInputCleared = (textInputNode) => textInputNode.disabled || textInputNode.value === '';
            const checkIsDatePickerCleared = (datePickerNode) => {
                const datePickerInput = datePickerNode.querySelector('.ibexa-picker__input');
                const isDisabled = datePickerInput.disabled;
                const value = datePickerInput.dataset.timestamp ?? '';

                return isDisabled || value === '';
            };

            return (
                textInputNodes.every(checkIsTextInputCleared) &&
                dropdownNodes.every(checkIsDropdownCleared) &&
                datePickerNodes.every(checkIsDatePickerCleared)
            );
        };
        const clearForm = () => {
            textInputNodes.forEach((textInputNode) => {
                if (!textInputNode.disabled) {
                    textInputNode.value = '';
                }
            });
            dropdownNodes.forEach((dropdownNode) => {
                const isDisabled = dropdownNode.classList.contains('ibexa-dropdown--disabled');

                if (!isDisabled) {
                    const dropdown = dropdownNode.ibexaInstance;

                    if (dropdown.canSelectOnlyOne) {
                        const select = dropdownNode.querySelector('.ibexa-dropdown__source select');
                        const firstOption = dropdownNode.querySelector('.ibexa-dropdown__source option');
                        const isFirstOptionSelected = select.value === firstOption.value;

                        if (!isFirstOptionSelected) {
                            dropdown.selectFirstOption();
                        }
                    } else {
                        dropdown.clearCurrentSelection();
                    }
                }
            });
            datePickerNodes.forEach((datePickerNode) => {
                const datePickerInput = datePickerNode.querySelector('.ibexa-picker__input');
                const isDisabled = datePickerInput.disabled;

                if (!isDisabled) {
                    datePickerInput._flatpickr.clear();
                }
            });
        };
        const handleFormClear = () => {
            clearForm();
            clearBtn.disabled = true;
            applyBtn.disabled = !checkFieldsValuesChanged();
            applyBtn.click();
        };
        const handleInputChange = () => {
            clearBtn.disabled = checkAreFiltersCleared();
            applyBtn.disabled = !checkFieldsValuesChanged();
        };

        dropdownNodes.forEach((dropdownNode) => {
            const dropdown = dropdownNode.ibexaInstance;
            const originalValue = [...dropdown.getSelectedItems()].map((item) => item.value);

            originalValuesMap.set(dropdown, originalValue);
        });
        textInputNodes.forEach((textInputNode) => {
            const originalValue = textInputNode.value;

            originalValuesMap.set(textInputNode, originalValue);
        });
        datePickerNodes.forEach((datePickerNode) => {
            const datePickerInput = datePickerNode.querySelector('.ibexa-picker__input');
            const originalValue = datePickerInput.dataset.timestamp ?? '';

            originalValuesMap.set(datePickerNode, originalValue);
        });

        if (applyBtn) {
            applyBtn.disabled = true;
        }

        if (clearBtn) {
            clearBtn.disabled = checkAreFiltersCleared();
            clearBtn.addEventListener('click', handleFormClear, false);
        }

        dropdownNodes.forEach((dropdownNode) => {
            const select = dropdownNode.querySelector('.ibexa-input--select');

            select.addEventListener('change', handleInputChange, false);
        });
        textInputNodes.forEach((textInputNode) => textInputNode.addEventListener('input', handleInputChange, false));
        datePickerNodes.forEach((datePickerNode) => {
            const datePickerInput = datePickerNode.querySelector('.ibexa-picker__input');

            datePickerInput.addEventListener('input', handleInputChange, false);
        });
    });
})(window, window.document);
