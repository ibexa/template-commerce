(function (global, doc) {
    const popupMenus = doc.querySelectorAll('.ibexa-store-popup-menu');

    if (!popupMenus.length) {
        return;
    }

    const toggleMenu = ({ currentTarget }) => {
        const popupMenu = currentTarget.closest('.ibexa-store-popup-menu');

        popupMenu.classList.toggle('ibexa-store-popup-menu--collapsed');
    };

    popupMenus.forEach((popupMenu) =>
        popupMenu.querySelector('.ibexa-store-popup-menu__toggler').addEventListener('click', toggleMenu, false),
    );
})(window, window.document);
