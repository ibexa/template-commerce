const FORM_ELEMENT_TAGS = ['input', 'select', 'textarea'];

export default class BillingAndShipping {
    constructor(options) {
        this.container = options.container;

        this.attachCopyBillingAddressListener = this.attachCopyBillingAddressListener.bind(this);
    }

    init() {
        this.attachCopyBillingAddressListener();
    }

    attachCopyBillingAddressListener() {
        const copyCheckbox = this.container.querySelector('[data-ibexa-address-selector]');

        if (!copyCheckbox) {
            return;
        }

        const { ibexaAddressSelector } = copyCheckbox.dataset;
        const selectAddress = this.container.querySelector(ibexaAddressSelector);

        copyCheckbox.addEventListener('change', () => {
            const isChecked = copyCheckbox.checked;

            if (FORM_ELEMENT_TAGS.includes(selectAddress.tagName.toLowerCase())) {
                selectAddress.disabled = isChecked;
            } else {
                const formElements = selectAddress.querySelectorAll(FORM_ELEMENT_TAGS.join(','));

                formElements.forEach((formElement) => {
                    formElement.disabled = isChecked;
                });
            }
        });
    }
}
