(function (global, doc) {
    const tuckedMenus = doc.querySelectorAll('.ibexa-store-tucked-menu');

    tuckedMenus.forEach((tuckedMenu) => {
        const tuckedMenuBtn = tuckedMenu.querySelector('.ibexa-store-tucked-menu__btn');
        const popupMenu = tuckedMenu.querySelector('.ibexa-store-tucked-menu__popup-menu');
        const handleClickOutsidePopup = (event) => {
            const isClickInsideTuckedMenu = event.target.closest('.ibexa-store-tucked-menu') === tuckedMenu;

            if (isClickInsideTuckedMenu) {
                return;
            }

            popupMenu.classList.add('ibexa-store-tucked-menu__popup-menu--hidden');
            doc.removeEventListener('click', handleClickOutsidePopup, false);
        };
        const handleBtnClick = () => {
            const isPopupOpened = !popupMenu.classList.contains('ibexa-store-tucked-menu__popup-menu--hidden');

            popupMenu.classList.toggle('ibexa-store-tucked-menu__popup-menu--hidden', isPopupOpened);

            if (isPopupOpened) {
                doc.removeEventListener('click', handleClickOutsidePopup, false);
            } else {
                doc.addEventListener('click', handleClickOutsidePopup, false);
            }
        };

        tuckedMenuBtn.addEventListener('click', handleBtnClick, false);
    });
})(window, window.document, window.ibexa, window.Popper);
