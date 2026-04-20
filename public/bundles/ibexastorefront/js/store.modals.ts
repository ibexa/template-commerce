(function (global: Window, doc: Document) {
    const modalsNodes = doc.querySelectorAll<HTMLElement>('.ibexa-store-modal');
    const calculateScrollbarWidth = () => {
        const outer = doc.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.width = '100px';

        const inner = doc.createElement('div');
        inner.style.width = '100%';

        doc.body.appendChild(outer);
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

        doc.body.removeChild(outer);

        return scrollbarWidth;
    };
    const handleModalOpen = (modalNode: HTMLElement) => {
        // eslint-disable-next-line no-param-reassign
        doc.body.style.overflow = 'hidden';

        if (doc.body.scrollHeight > window.innerHeight) {
            // eslint-disable-next-line no-param-reassign
            doc.body.style.paddingRight = `${calculateScrollbarWidth()}px`;
        }

        modalNode.classList.add('ibexa-store-modal--open');

        dispatchOpenedModalEvent(modalNode);
    };
    const handleModalClose = (modalNode: HTMLElement) => {
        // eslint-disable-next-line no-param-reassign
        doc.body.style.overflow = '';
        // eslint-disable-next-line no-param-reassign
        doc.body.style.paddingRight = '0px';

        modalNode.classList.remove('ibexa-store-modal--open');

        dispatchClosedModalEvent(modalNode);
    };
    const dispatchClosedModalEvent = (modalNode: HTMLElement) => {
        modalNode.dispatchEvent(new CustomEvent('ibexa-store-modal:closed'));
    };
    const dispatchOpenedModalEvent = (modalNode: HTMLElement) => {
        modalNode.dispatchEvent(new CustomEvent('ibexa-store-modal:opened'));
    };
    const initializeModal = (modalNode: HTMLElement) => {
        const modalDialog = modalNode.querySelector<HTMLDivElement>('.ibexa-store-modal-dialog');
        const isClosable = modalNode.classList.contains('ibexa-store-modal--closable');

        if (isClosable && modalDialog) {
            const closeBtn = modalDialog.querySelector<HTMLButtonElement>('.ibexa-store-modal-dialog__close-btn');

            closeBtn?.addEventListener(
                'click',
                () => {
                    handleModalClose(modalNode);
                },
                false,
            );

            modalNode.addEventListener(
                'click',
                (event) => {
                    const { target } = event;

                    if (target instanceof Node && !modalDialog.contains(target)) {
                        handleModalClose(modalNode);
                    }
                },
                false,
            );
        }

        modalNode.addEventListener(
            'ibexa-store-modal:open',
            () => {
                handleModalOpen(modalNode);
            },
            false,
        );
        modalNode.addEventListener(
            'ibexa-store-modal:close',
            () => {
                handleModalClose(modalNode);
            },
            false,
        );
    };

    modalsNodes.forEach((modalNode) => {
        initializeModal(modalNode);
    });
})(window, window.document);
