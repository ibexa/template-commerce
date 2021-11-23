(function(global, doc, eZ, bootstrap) {
    const resendEmailButtons = doc.querySelectorAll('.ibexa-btn--resend-email');
    const showEmailButtons = doc.querySelectorAll('.ibexa-btn--show-email');
    const resendEmail = (event) => {
        const { emailId } = event.currentTarget.dataset;
        const url = Routing.generate('siso_admin_mail_resend_ajax', { id: emailId });

        fetch(url, { mode: 'same-origin', credentials: 'same-origin' })
            .then(eZ.helpers.request.getTextFromResponse)
            .then(eZ.helpers.notification.showSuccessNotification)
            .catch(eZ.helpers.notification.showErrorNotification);
    };
    const showEmail = (emailPreview) => {
        const modal = doc.querySelector('.ez-modal--show-email');
        const modalBody = modal.querySelector('iframe');

        modalBody.srcdoc = emailPreview;

        bootstrap.Modal.getOrCreateInstance(modal).show();
    };
    const fetchEmailPreview = (event) => {
        const { emailId } = event.currentTarget.dataset;
        const url = Routing.generate('siso_admin_mail_ajax', { id: emailId });

        fetch(url, { mode: 'same-origin', credentials: 'same-origin' })
            .then(eZ.helpers.request.getTextFromResponse)
            .then(showEmail)
            .catch(eZ.helpers.notification.showErrorNotification);
    };

    resendEmailButtons.forEach((resendEmailButton) => resendEmailButton.addEventListener('click', resendEmail, false));
    showEmailButtons.forEach((showEmailButton) => showEmailButton.addEventListener('click', fetchEmailPreview, false));
})(window, window.document, window.eZ, window.bootstrap);
