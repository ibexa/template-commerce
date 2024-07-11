(function (global, doc, Translator) {
    const transitionModal = doc.querySelector('.ibexa-modal--state-transition-confirmation');
    const transitionModalBody = transitionModal.querySelector('.modal-body');
    const confirmBtn = transitionModal.querySelector('.ibexa-btn--confirm');
    const transitionForm = doc.querySelector('.ibexa-state-transition-form');
    const transitionSelect = transitionForm.querySelector('.ibexa-state-transition-form__select');
    let selectedTransition;

    confirmBtn.addEventListener(
        'click',
        () => {
            transitionSelect.value = selectedTransition;

            transitionForm.submit();
        },
        false,
    );

    transitionModal.addEventListener(
        'show.bs.modal',
        ({ relatedTarget }) => {
            const status = relatedTarget.dataset.transitionTarget;

            transitionModalBody.innerHTML = Translator.trans(
                /*@Desc("Change payment status to %status%?")*/ 'ibexa.state.transition.modal.transition.body',
                { status },
                'ibexa_payment_ui',
            );

            selectedTransition = relatedTarget.dataset.transition;
        },
        false,
    );
})(window, window.document, window.Translator);
