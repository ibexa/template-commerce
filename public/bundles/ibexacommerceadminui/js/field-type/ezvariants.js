(function(global, doc, ibexa, Translator) {
    const SELECTOR_FIELD = '.ibexa-field-edit--ezvariants';
    const SELECTOR_VARIANTS_INPUT = '.ibexa-field-edit__variants-input';
    const fields = doc.querySelectorAll(SELECTOR_FIELD);
    const initField = (field) => {
        const inputValue = JSON.parse(field.querySelector('.ibexa-field-edit__variants-input').value);

        if (!inputValue) {
            return;
        }

        inputValue.forEach((value) => addVariant(field, value.id, value));
    };
    const addVariant = (field, variantId, values) => {
        const variantTypes = JSON.parse(field.dataset.variantTypes);
        const variantConfig = variantTypes.find((variantType) => variantType.id === variantId);
        const groupsWrapper = field.querySelector('.ibexa-variants__groups-wrapper');
        const customDropdown = field.querySelector('.ibexa-dropdown');
        const variantsNode = field.querySelector('.ibexa-variants');
        const groupFragment = doc.createDocumentFragment();
        const groupContainer = doc.createElement('div');
        const groupTemplate = groupsWrapper.dataset.template;
        const groupIndex = field.querySelectorAll('.ibexa-variants__group').length + 1;
        const descriptionLabel = Translator.trans(/*@Desc("Description")*/ 'field_types.description.label', {}, 'field_types_ui');
        const variantCodeLabel = Translator.trans(/*@Desc("Variant Code/SKU")*/ 'field_types.variant_code.label', {}, 'field_types_ui');
        const priceLabel = Translator.trans(/*@Desc("Price")*/ 'field_types.price.label', {}, 'field_types_ui');
        const groupLabel = Translator.trans(/*@Desc("Variant product")*/ 'field_types.group.label', {}, 'field_types_ui');
        const renderedGroupTemplate = groupTemplate.replace('{{ group_label }}', `${groupLabel} ${groupIndex}`);

        groupContainer.insertAdjacentHTML('beforeend', renderedGroupTemplate);

        const itemsWrapper = groupContainer.querySelector('.ibexa-variants__items-wrapper');
        const itemsElements = [
            {
                id: 'description',
                label: descriptionLabel,
                value: values ? values.description.value : '',
            },
            {
                id: 'variantCode',
                label: variantCodeLabel,
                value: values ? values.variantCode.value : '',
            },
            {
                id: 'priceNet',
                label: priceLabel,
                value: values ? values.priceNet.value : '',
            },
        ];

        for (let index = 1; index <= variantConfig.variant_levels; index++) {
            itemsElements.push({
                id: index,
                label: variantConfig[`variant_level_label_${index}`],
                value: values ? values[`characteristicCode${index}`].value : '',
            });
        }

        itemsElements.forEach((itemElements) => {
            const itemContainer = doc.createElement('div');
            const itemTemplate = itemsWrapper.dataset.template;
            const renderedItemTemplate = itemTemplate
                .replace('{{ item_id }}', itemElements.id)
                .replace('{{ item_label }}', itemElements.label);

            itemContainer.insertAdjacentHTML('beforeend', renderedItemTemplate);

            const itemInputs = itemContainer.querySelectorAll('.ibexa-variants__item-input');

            itemInputs.forEach((item) => {
                item.addEventListener('change', () => saveData(field, variantId), false);
                item.value = itemElements.value;
            });

            itemsWrapper.append(itemContainer.querySelector('.ibexa-variants__item'));
        });

        groupContainer.querySelector('.ibexa-btn--remove-variant').addEventListener(
            'click',
            (event) => {
                event.currentTarget.closest('.ibexa-variants__group').remove();

                if (!field.querySelector('.ibexa-variants__group')) {
                    customDropdown.classList.remove('ibexa-dropdown--hidden');
                    variantsNode.classList.remove('ibexa-variants--has-items');
                }

                saveData(field, variantId);
            },
            false
        );

        groupFragment.append(groupContainer.querySelector('.ibexa-variants__group'));
        groupsWrapper.append(groupFragment);

        customDropdown.classList.add('ibexa-dropdown--hidden');
        variantsNode.classList.add('ibexa-variants--has-items');
    };
    const attachEvents = (field) => {
        field.querySelector('.ibexa-btn--add-variant').addEventListener(
            'click',
            () => {
                const inputValue = JSON.parse(field.querySelector('.ibexa-field-edit__variants-input').value);
                const variantId = inputValue && inputValue.length ? inputValue[0].id : field.querySelector('.ibexa-input--select').value;

                addVariant(field, variantId);
            },
            false
        );
    };
    const saveData = (field, variantId) => {
        const itemsGroups = field.querySelectorAll('.ibexa-variants__group');
        const skuNode = doc.querySelector('#ezplatform_content_forms_content_edit_fieldsData_ses_sku_value');
        const vatNode = doc.querySelector('#ezplatform_content_forms_content_edit_fieldsData_ses_vat_code_value');
        const valueInput = field.querySelector('.ibexa-field-edit__variants-input');
        const data = [];
        const skuLabel = Translator.trans(/*@Desc("Sku")*/ 'field_types.sku.label', {}, 'field_types_ui');
        const vatLabel = Translator.trans(/*@Desc("VAT percent")*/ 'field_types.vat.label', {}, 'field_types_ui');
        const countryOfOriginLabel = Translator.trans(
            /*@Desc("dataMap Country of Origin")*/ 'field_types.country_of_origin.label',
            {},
            'field_types_ui'
        );

        itemsGroups.forEach((itemsGroup) => {
            const items = itemsGroup.querySelectorAll('.ibexa-variants__item');
            const itemData = {
                id: variantId,
                sku: {
                    label: skuLabel,
                    value: skuNode ? skuNode.value : '',
                },
                vatPercent: {
                    label: vatLabel,
                    value: vatNode ? vatNode.value : '',
                },
                dataMap_countryOfOrigin: {
                    label: countryOfOriginLabel,
                    value: '',
                },
            };

            items.forEach((item) => {
                const itemId = item.dataset.itemId;
                const value = item.querySelector('input').value;
                const label = item.querySelector('.ibexa-variants__item-label').innerHTML;

                if (isNaN(parseInt(itemId, 10))) {
                    itemData[itemId] = {
                        label: label,
                        value,
                    };
                } else {
                    itemData[`characteristicCode${itemId}`] = {
                        label: value,
                        value,
                    };

                    itemData[`characteristicLabel${itemId}`] = {
                        label,
                        value: label,
                    };
                }
            });

            if (!itemData.characteristicCode2) {
                itemData.characteristicCode2 = {
                    label: '',
                    value: '',
                };

                itemData.characteristicLabel2 = {
                    label: '',
                    value: '',
                };
            }

            data.push(itemData);
        });

        valueInput.value = JSON.stringify(data);
        valueInput.dispatchEvent(new CustomEvent('valueChange'));
    };

    fields.forEach(attachEvents);
    fields.forEach(initField);

    class EzVariantsValidator extends ibexa.BaseFieldValidator {
        validateInput(event) {
            const value = JSON.parse(event.target.value);
            const isError = event.target.required && (value === null || value.length === 0);
            const label = event.target.closest(SELECTOR_FIELD).querySelector('.ibexa-field-edit__label').innerHTML;
            const errorMessage = ibexa.errors.emptyField.replace('{fieldName}', label);

            return {
                isError,
                errorMessage,
            };
        }
    }

    const validator = new EzVariantsValidator({
        classInvalid: 'is-invalid',
        fieldSelector: SELECTOR_FIELD,
        eventsMap: [
            {
                selector: '.ibexa-field-edit__variants-input',
                eventName: 'valueChange',
                callback: 'validateInput',
                errorNodeSelectors: ['.ibexa-form-error'],
            },
        ],
    });

    validator.init();

    ibexa.addConfig('fieldTypeValidators', [validator], true);
})(window, window.document, window.ibexa, window.Translator);
