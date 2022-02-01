(function(global, doc, ibexa, React, ReactDOM) {
    const imageEditorContainer = doc.querySelector('.ibexa-image-editor');
    const editImageButtons = doc.querySelectorAll('.ibexa-field-edit--ezimage .ibexa-field-edit-preview__action--edit');
    const removeImageButtons = doc.querySelectorAll('.ibexa-field-edit--ezimage .ibexa-field-edit-preview__action--remove');
    const closeImageEditor = () => ReactDOM.unmountComponentAtNode(imageEditorContainer);
    const openImageEditor = (event) => {
        const imageNode = event.currentTarget
            .closest('.ibexa-field-edit-preview__media-wrapper')
            .querySelector('.ibexa-field-edit-preview__media');
        const base64Input = event.currentTarget.closest('.ibexa-field-edit--ezimage').querySelector('.ibexa-data-source__base64');
        const additionalDataInput = event.currentTarget
            .closest('.ibexa-field-edit--ezimage')
            .querySelector('.ibexa-field-edit-preview__additional-data');
        const imageUrl = imageNode.src;
        const imageName = event.currentTarget.closest('.ibexa-field-edit-preview').querySelector('.ibexa-field-edit-preview__file-name')
            .innerHTML;
        const setNewImage = (image, additionalData) => {
            imageNode.src = image.src;
            base64Input.value = image.src.split(',')[1];
            additionalDataInput.value = JSON.stringify(additionalData);

            closeImageEditor();
        };
        const additionalData = JSON.parse(additionalDataInput.value);
        const renderImageEditor = (image = imageUrl) => {
            ReactDOM.render(
                React.createElement(ibexa.modules.ImageEditorModule, {
                    onCancel: closeImageEditor,
                    onConfirm: setNewImage,
                    imageUrl: image,
                    imageName,
                    additionalData,
                }),
                imageEditorContainer
            );
        };

        if (imageUrl.includes('data:image')) {
            renderImageEditor();
        } else {
            const { contentId, fieldDefinitionIdentifier } = event.currentTarget.dataset;
            const url = Routing.generate('ibexa.image_editor.get_base_64', { contentId, fieldIdentifier: fieldDefinitionIdentifier });
            const token = doc.querySelector('meta[name="CSRF-Token"]').content;
            const request = new Request(url, {
                headers: {
                    'X-CSRF-Token': token,
                    Accept: 'application/json',
                },
                mode: 'same-origin',
                credentials: 'same-origin',
            });

            fetch(request)
                .then(ibexa.helpers.request.getJsonFromResponse)
                .then((response) => {
                    renderImageEditor(response.base64);
                })
                .catch(ibexa.helpers.notification.showErrorNotification);
        }
    };
    const clearImageEditorInputs = (event) => {
        const base64Input = event.currentTarget.closest('.ibexa-field-edit--ezimage').querySelector('.ibexa-data-source__base64');
        const additionalDataInput = event.currentTarget
            .closest('.ibexa-field-edit--ezimage')
            .querySelector('.ibexa-field-edit-preview__additional-data');

        base64Input.value = '';
        additionalDataInput.value = '{}';
    };

    editImageButtons.forEach((editImageButton) => editImageButton.addEventListener('click', openImageEditor, false));
    removeImageButtons.forEach((removeImageButton) => removeImageButton.addEventListener('click', clearImageEditorInputs, false));
})(window, window.document, window.ibexa, window.React, window.ReactDOM);
