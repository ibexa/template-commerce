export const guardQuantityInputValue = (quantityInput, getMaxQuantity, options = {}) => {
    const isAllowEmpty = options?.allowEmpty ?? false;

    quantityInput.addEventListener('keydown', preventNonDigitCharacters, false);
    quantityInput.addEventListener('keyup', () => preventWrongQuantity(quantityInput, getMaxQuantity), false);
    quantityInput.addEventListener('input', () => preventWrongQuantity(quantityInput, getMaxQuantity), false);
    quantityInput.addEventListener(
        'focusout',
        () => {
            const valueBefore = quantityInput.value;

            if (!isAllowEmpty) {
                preventEmpty(quantityInput, getMaxQuantity);
            }

            preventZero(quantityInput, getMaxQuantity);

            if (quantityInput.value !== valueBefore) {
                quantityInput.dispatchEvent(new Event('change'));
            }
        },
        false,
    );
};

export const preventNonDigitCharacters = (event) => {
    const { key, altKey, ctrlKey, metaKey, shiftKey } = event;
    const isSpecialKey = key.length > 1;
    const isDigitKey = key >= '0' && key <= '9';
    const isOtherSpecialKeyPressed = altKey || ctrlKey || metaKey || shiftKey;

    if (!isSpecialKey && !isDigitKey && !isOtherSpecialKeyPressed) {
        event.preventDefault();

        return false;
    }
};

export const preventWrongQuantity = (quantityInput, getMaxQuantity) => {
    const parsedValue = parseInt(quantityInput.value, 10);
    const maxQuantity = getMaxQuantity();
    const hasLeadingZeros = !Number.isNaN(parsedValue) && quantityInput.value !== parsedValue.toString();

    if (hasLeadingZeros) {
        quantityInput.value = parsedValue;
    }

    if (parsedValue > maxQuantity) {
        quantityInput.value = maxQuantity;

        return;
    }
};

export const preventEmpty = (quantityInput, getMaxQuantity) => {
    const parsedValue = parseInt(quantityInput.value, 10);
    const maxQuantity = getMaxQuantity();

    if (!Number.isInteger(parsedValue)) {
        quantityInput.value = maxQuantity === 0 ? 0 : 1;
    }
};

export const preventZero = (quantityInput, getMaxQuantity) => {
    const parsedValue = parseInt(quantityInput.value, 10);
    const maxQuantity = getMaxQuantity();

    if (Number.isInteger(parsedValue) && parsedValue === 0 && maxQuantity !== 0) {
        quantityInput.value = 1;
    }
};

export const forceValidQuantityInInput = (quantityInput, getMaxQuantity) => {
    const parsedValue = parseInt(quantityInput.value, 10);
    const maxQuantity = getMaxQuantity();

    if (maxQuantity === 0) {
        quantityInput.value = 0;

        return;
    }

    if (Number.isNaN(parsedValue) || parsedValue === 0) {
        quantityInput.value = 1;

        return;
    }

    if (parsedValue > maxQuantity) {
        quantityInput.value = maxQuantity;

        return;
    }

    const hasLeadingZeros = !Number.isNaN(parsedValue) && quantityInput.value !== parsedValue.toString();

    if (hasLeadingZeros) {
        quantityInput.value = parsedValue;
    }
};

export const getValidQuantity = (value, minQuantity, maxQuantity) => {
    if (minQuantity > maxQuantity && minQuantity >= 0) {
        throw new Error(
            'helper:quantity.input:getValidQuantity: minQuantity cannot be negative number and cannot be greater than maxQuantity',
        );
    }

    const parsedValue = parseInt(value, 10);

    if (Number.isNaN(parsedValue)) {
        return maxQuantity === 0 ? 0 : 1;
    }

    if (parsedValue > maxQuantity) {
        return maxQuantity;
    }

    if (parsedValue < minQuantity) {
        return minQuantity;
    }

    return parsedValue;
};
