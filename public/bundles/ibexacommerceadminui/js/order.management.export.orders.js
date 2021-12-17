(function(global, doc) {
    const exportButton = doc.querySelector('.ibexa-btn--export-orders');

    exportButton.addEventListener(
        'click',
        () => {
            global.onbeforeunload = function() {
                return null;
            };
        },
        false
    );
})(window, window.document);
