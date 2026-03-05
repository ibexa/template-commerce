(function (global, doc) {
    const disableDiscountForm = doc.querySelector('#disable-discount-form');
    const enableDiscountForm = doc.querySelector('#enable-discount-form');
    const disableDiscountBtns = doc.querySelectorAll('.ibexa-dc-discounts-list__enable-discount-btn');
    const enableDiscountBtns = doc.querySelectorAll('.ibexa-dc-discounts-list__disable-discount-btn');

    enableDiscountBtns.forEach((disableBtn) => {
        disableBtn.addEventListener(
            'click',
            () => {
                disableDiscountForm.action = disableBtn.dataset.formAction;
            },
            false,
        );
    });

    disableDiscountBtns.forEach((enableBtn) => {
        enableBtn.addEventListener(
            'click',
            () => {
                enableDiscountForm.action = enableBtn.dataset.formAction;
            },
            false,
        );
    });
})(window, window.document);
