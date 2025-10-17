import QuickOrder from '@ibexa-cart/src/bundle/Resources/public/js/component/quick.order';

export default class StorefrontQuickOrder extends QuickOrder {
    constructor(options) {
        super(options);

        this.fileWrapperContent = this.container.querySelector('.ibexa-store-quick-order__file-wrapper-content');
        this.addFileBtn = this.container.querySelector('.ibexa-store-quick-order__file-add-btn');
        this.fileAddedInfo = this.container.querySelector('.ibexa-store-quick-order__file-added-info');
        this.fileAddedInfoTextTemplate = this.fileAddedInfo.dataset.infoText;

        this.allowDropOnDiv = this.allowDropOnDiv.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleAddFileBtnClicked = this.handleAddFileBtnClicked.bind(this);
        this.handleFileChanged = this.handleFileChanged.bind(this);
    }

    init() {
        super.init(...arguments);

        this.fileWrapperContent.addEventListener('dragover', this.allowDropOnDiv, false);
        this.fileWrapperContent.addEventListener('drop', this.handleFileDrop, false);
        this.addFileBtn.addEventListener('click', this.handleAddFileBtnClicked, false);
        this.fileInput.addEventListener('change', this.handleFileChanged, false);
    }

    allowDropOnDiv(event) {
        event.preventDefault();
    }

    handleFileDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        const { files } = event.dataTransfer;

        this.fileInput.files = files;

        this.fileInput.dispatchEvent(new Event('change'));
    }

    handleAddFileBtnClicked() {
        this.fileInput.click();
    }

    handleFileChanged() {
        const { files } = this.fileInput;
        const isFileAdded = !!files.length;

        if (isFileAdded) {
            const fileName = files[0].name;

            this.fileAddedInfo.innerText = this.fileAddedInfoTextTemplate.replaceAll('__file_name__', fileName);
        } else {
            this.fileAddedInfo.innerText = '';
        }
    }
}
