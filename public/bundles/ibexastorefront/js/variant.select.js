(function (global, doc) {
    const variantSelectorNode = doc.querySelector('#add_to_cart_variant');

    if (!variantSelectorNode) {
        return;
    }

    const variantSelectorForm = variantSelectorNode.closest('form');
    const showVariantPage = () => {
        const selectedVariantCode = variantSelectorNode.value;

        if (!selectedVariantCode) {
            return;
        }

        const { productVariantViewLinkTemplate: variantViewLinkTemplate } = variantSelectorForm.dataset;
        const variantViewLink = variantViewLinkTemplate.replace('__variant_code__', selectedVariantCode);

        variantSelectorForm.action = variantViewLink;
        variantSelectorForm.submit();
    };

    variantSelectorNode.addEventListener('change', showVariantPage, false);
})(window, window.document);
