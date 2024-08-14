const FORM_ELEMENT_TAGS = ['input', 'select', 'textarea'];

export default class BillingAndShipping {
    constructor(options) {
        this.container = options.container;
        this.copyCheckbox = this.container.querySelector('[data-ibexa-address-selector]');

        this.attachCopyBillingAddressListener = this.attachCopyBillingAddressListener.bind(this);
        this.setInitialFormDisabledState = this.setInitialFormDisabledState.bind(this);
        this.setFormDisabledState = this.setFormDisabledState.bind(this);
    }

    init() {
        this.setInitialFormDisabledState();
        this.attachCopyBillingAddressListener();
    }

    setInitialFormDisabledState() {
        if (!this.copyCheckbox) {
            return;
        }

        this.setFormDisabledState();
    }

    setFormDisabledState() {
        const { ibexaAddressSelector } = this.copyCheckbox.dataset;
        const selectAddress = this.container.querySelector(ibexaAddressSelector);
        const isChecked = this.copyCheckbox.checked;

        if (FORM_ELEMENT_TAGS.includes(selectAddress.tagName.toLowerCase())) {
            selectAddress.disabled = isChecked;
        } else {
            const formElements = selectAddress.querySelectorAll(FORM_ELEMENT_TAGS.join(','));

            formElements.forEach((formElement) => {
                formElement.disabled = isChecked;
            });
        }
    }

    attachCopyBillingAddressListener() {
        if (!this.copyCheckbox) {
            return;
        }

        this.copyCheckbox.addEventListener('change', () => {
            this.setFormDisabledState();
        });
    }
}
