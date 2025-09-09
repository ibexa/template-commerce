(function (global, doc) {
    const SET_STICKY_THRESHOLD = 200;
    const UNSET_STICKY_THRESHOLD = 10;
    const wizardLayoutContainer = doc.querySelector('.ibexa-dc-wizard-layout');
    const wizardContainer = doc.querySelector('.ibexa-dc-wizard');
    const wizardHeader = wizardContainer.querySelector('.ibexa-dc-wizard__header');
    const wizardStepsWrapper = wizardContainer.querySelector('.ibexa-dc-wizard__steps-wrapper');

    if (!wizardHeader || !wizardStepsWrapper) {
        return;
    }

    let animationFrame = null;
    const handleStickyStylesOnScroll = () => {
        const layoutContainerOffsetTop = wizardLayoutContainer.offsetTop;
        const wizardContainerTopPosition = wizardContainer.getBoundingClientRect().top;
        const isSticky = wizardHeader.classList.contains('ibexa-dc-wizard__header--sticky');
        const threshold = isSticky ? UNSET_STICKY_THRESHOLD : SET_STICKY_THRESHOLD;
        const shouldBeSticky = wizardContainerTopPosition - layoutContainerOffsetTop + threshold < 0;

        wizardHeader.classList.toggle('ibexa-dc-wizard__header--sticky', shouldBeSticky);
        wizardStepsWrapper.classList.toggle('ibexa-dc-wizard__steps-wrapper--sticky', shouldBeSticky);
    };
    const handleLayoutContainerScroll = () => {
        if (animationFrame) {
            global.cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(handleStickyStylesOnScroll);
    };

    wizardLayoutContainer.addEventListener('scroll', handleLayoutContainerScroll, false);
})(window, window.document);
