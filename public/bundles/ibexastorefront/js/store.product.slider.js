(function (global, doc) {
    let currentVisibleThumbnail = 1;
    const visibleThumbnailsCount = 4;
    const sliderContainer = doc.querySelector('.ibexa-store-product-slider');

    if (!sliderContainer) {
        return;
    }

    const productThumbnails = sliderContainer.querySelectorAll('.ibexa-store-product-slider__thumbnail');
    const thumbnailsContainer = sliderContainer.querySelector('.ibexa-store-product-slider__thumbnails');
    const imagePreview = sliderContainer.querySelector('.ibexa-store-product-slider__image-preview img');
    const selectPrevThumbnailBtn = sliderContainer.querySelector(
        '.ibexa-store-product-slider__preview-wrapper .ibexa-store-product-slider__control--prev',
    );
    const selectNextThumbnailBtn = sliderContainer.querySelector(
        '.ibexa-store-product-slider__preview-wrapper .ibexa-store-product-slider__control--next',
    );
    const showPrevThumbnailBtn = sliderContainer.querySelector(
        '.ibexa-store-product-slider__controls-wrapper .ibexa-store-product-slider__control--prev',
    );
    const showNextThumbnailBtn = sliderContainer.querySelector(
        '.ibexa-store-product-slider__controls-wrapper .ibexa-store-product-slider__control--next',
    );
    const translateStep = 120;
    const thumbnailsCount = productThumbnails.length;
    const setNewMiniature = (oldThumbnail, newThumbnail) => {
        const imageThumbnail = newThumbnail.querySelector('img');

        oldThumbnail.classList.remove('ibexa-store-product-slider__thumbnail--active');
        newThumbnail.classList.add('ibexa-store-product-slider__thumbnail--active');

        imagePreview.src = imageThumbnail.src;
    };
    const selectThumbnail = ({ currentTarget }) => {
        const activeThumbnail = sliderContainer.querySelector('.ibexa-store-product-slider__thumbnail--active');

        setNewMiniature(activeThumbnail, currentTarget);
    };
    const selectPrevThumbnail = () => {
        const activeThumbnail = sliderContainer.querySelector('.ibexa-store-product-slider__thumbnail--active');

        if (activeThumbnail.previousElementSibling) {
            setNewMiniature(activeThumbnail, activeThumbnail.previousElementSibling);
        }
    };
    const selectNextThumbnail = () => {
        const activeThumbnail = sliderContainer.querySelector('.ibexa-store-product-slider__thumbnail--active');

        if (activeThumbnail.nextElementSibling) {
            setNewMiniature(activeThumbnail, activeThumbnail.nextElementSibling);
        }
    };
    const showPrevThumbnail = () => {
        const isFirstThumbnailVisible = currentVisibleThumbnail === 0;

        if (isFirstThumbnailVisible) {
            return;
        }

        const transform = `translateY(-${translateStep * --currentVisibleThumbnail}px)`;

        thumbnailsContainer.style.transform = transform;
    };
    const showNextThumbnail = () => {
        const isLastThumbnailVisible = thumbnailsCount - visibleThumbnailsCount === currentVisibleThumbnail;

        if (isLastThumbnailVisible) {
            return;
        }

        const transform = `translateY(-${translateStep * ++currentVisibleThumbnail}px)`;

        thumbnailsContainer.style.transform = transform;
    };

    productThumbnails.forEach((productThumbnail) => productThumbnail.addEventListener('click', selectThumbnail, false));
    selectPrevThumbnailBtn.addEventListener('click', selectPrevThumbnail, false);
    selectNextThumbnailBtn.addEventListener('click', selectNextThumbnail, false);
    showPrevThumbnailBtn.addEventListener('click', showPrevThumbnail, false);
    showNextThumbnailBtn.addEventListener('click', showNextThumbnail, false);
})(window, window.document);
