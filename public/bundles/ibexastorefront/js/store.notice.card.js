(function (global, doc) {
    const closeButtons = doc.querySelectorAll('.ibexa-store-notice-card__close-btn');
    const handleClose = ({ currentTarget }) => {
        const noticeCard = currentTarget.closest('.ibexa-store-notice-card');

        noticeCard.remove();
    };

    closeButtons.forEach((closeButton) => {
        closeButton.addEventListener('click', handleClose, false);
    });
})(window, window.document);
