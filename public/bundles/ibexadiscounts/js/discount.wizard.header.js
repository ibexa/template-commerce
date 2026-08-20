(function (global, doc) {
    const SET_STICKY_THRESHOLD = 200;
    const UNSET_STICKY_THRESHOLD = 10;
    const wizardLayoutContainer = doc.querySelector('.ibexa-dc-wizard-layout');
    const wizardContainer = doc.querySelector('.ibexa-dc-wizard');
    const wizardHeader = wizardContainer.querySelector('.ibexa-dc-wizard__header');
    const wizardStepsWrapper = wizardContainer.querySelector('.ibexa-dc-wizard__steps-wrapper');
    const wizardFooter = wizardContainer.querySelector('.ibexa-dc-wizard__footer');

    if (!wizardHeader || !wizardStepsWrapper || !wizardFooter) {
        return;
    }

    let animationFrame = null;
    const handleStickyStylesOnScroll = () => {
        const layoutContainerOffsetTop = wizardLayoutContainer.offsetTop;
        const wizardContainerTopPosition = wizardContainer.getBoundingClientRect().top;
        const wizardContainerBottomPosition = wizardContainer.getBoundingClientRect().bottom;
        const isHeaderSticky = wizardHeader.classList.contains('ibexa-dc-wizard__header--sticky');
        const headerThreshold = isHeaderSticky ? UNSET_STICKY_THRESHOLD : SET_STICKY_THRESHOLD;

        const shouldHeaderBeSticky = wizardContainerTopPosition - layoutContainerOffsetTop + headerThreshold < 0;
        const shouldFooterBeSticky = wizardContainerBottomPosition > window.innerHeight;

        wizardHeader.classList.toggle('ibexa-dc-wizard__header--sticky', shouldHeaderBeSticky);
        wizardStepsWrapper.classList.toggle('ibexa-dc-wizard__steps-wrapper--sticky', shouldHeaderBeSticky);
        wizardFooter.classList.toggle('ibexa-dc-wizard__footer--sticky', shouldFooterBeSticky);
    };
    const handleLayoutContainerScroll = () => {
        if (animationFrame) {
            global.cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(handleStickyStylesOnScroll);
    };

    wizardLayoutContainer.addEventListener('scroll', handleLayoutContainerScroll, false);

    handleStickyStylesOnScroll();
})(window, window.document);
