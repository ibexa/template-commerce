(function (global, doc) {
    const isHTMLElement = (element: EventTarget | null): element is HTMLElement => {
        return element instanceof HTMLElement;
    };

    doc.addEventListener(
        'DOMContentLoaded',
        () => {
            const btns = doc.querySelectorAll('.ibexa-store-btn--trigger');
            const trigger = (event: Event) => {
                event.preventDefault();

                const button = event.currentTarget;

                if (!button || !isHTMLElement(button) || !button.dataset.click) {
                    return;
                }

                const triggerTargetElement = doc.querySelector(button.dataset.click);

                triggerTargetElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            };

            btns.forEach((btn) => {
                btn.addEventListener('click', trigger, false);
            });
        },
        false,
    );
})(window, document);
