import { isElement, notNullQuerySelector } from '../helper/dom.helper';
import { AddToShoppingList } from '@ibexa-shopping-list/src/bundle/Resources/public/js/component/add.to.shopping.list';
import { NotificationDetail } from '../store.notifications';
import { StorefrontShoppingListsList } from './storefront.shopping.lists.list';
import { checkIsHttpError } from '@ibexa-shopping-list/src/bundle/Resources/public/js/service/shopping.list';

const POPUP_MARGIN = 60;
const NOT_ACCEPTABLE_STATUS = 406;

export class StorefrontAddToShoppingList extends AddToShoppingList<StorefrontShoppingListsList> {
    private toggleBtnNode: HTMLButtonElement | null = null;
    private popupNode: HTMLElement | null = null;

    private popupPositionAnimationFrameId: number | null = null;

    private maxNumberOfEntriesMessage: string | null;

    private isSimpleType: boolean;

    constructor(config: { node: HTMLElement }) {
        super({
            ...config,
            ListClass: StorefrontShoppingListsList,
        });

        this.isSimpleType = this.node.classList.contains('ibexa-store-add-to-shopping-list--simple');

        if (!this.isSimpleType) {
            this.popupNode = notNullQuerySelector<HTMLDivElement>(this.node, '.ibexa-store-add-to-shopping-list__popup');
            this.toggleBtnNode = notNullQuerySelector<HTMLButtonElement>(this.node, '.ibexa-store-add-to-shopping-list__toggler-btn');
        }

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        const { maxNumberOfEntriesMessage } = this.node.dataset;

        this.maxNumberOfEntriesMessage = maxNumberOfEntriesMessage ?? null;
    }

    init() {
        super.init();

        this.attachEvents();
    }

    private attachEvents() {
        if (!this.toggleBtnNode) {
            return;
        }

        this.toggleBtnNode.addEventListener(
            'click',
            () => {
                this.toggleMenu();
            },
            false,
        );
    }

    private showMaxNumberOfEntriesMessage() {
        document.body.dispatchEvent(
            new CustomEvent<NotificationDetail>('ibexa-store-notify', {
                detail: { label: null, message: this.maxNumberOfEntriesMessage, type: 'error' },
            }),
        );
    }

    protected onItemSelectError(isSelected: boolean, error: unknown) {
        if (isSelected) {
            if (checkIsHttpError(error) && error.response.status === NOT_ACCEPTABLE_STATUS) {
                this.showMaxNumberOfEntriesMessage();
            } else {
                console.error(error);
            }
        } else {
            console.error(error);
        }
    }

    private handleClickOutside(event: MouseEvent): void {
        if (!isElement(event.target)) {
            return;
        }

        const closestDropdownRoot = event.target.closest('.ibexa-store-add-to-shopping-list');

        if (!closestDropdownRoot || closestDropdownRoot !== this.node) {
            this.toggleMenu();
        }
    }

    private handleScroll(): void {
        if (this.popupPositionAnimationFrameId) {
            window.cancelAnimationFrame(this.popupPositionAnimationFrameId);
        }

        this.popupPositionAnimationFrameId = window.requestAnimationFrame(() => {
            this.applyPopupPosition();
        });
    }

    private toggleMenu() {
        const isClosed = this.node.classList.contains('ibexa-store-add-to-shopping-list--collapsed');

        this.node.classList.toggle('ibexa-store-add-to-shopping-list--collapsed', !isClosed);

        if (isClosed) {
            this.applyPopupPosition();
            document.body.addEventListener('click', this.handleClickOutside, false); // eslint-disable-line @typescript-eslint/unbound-method
            window.addEventListener('scroll', this.handleScroll, true); // eslint-disable-line @typescript-eslint/unbound-method
        } else {
            document.body.removeEventListener('click', this.handleClickOutside, false); // eslint-disable-line @typescript-eslint/unbound-method
            window.removeEventListener('scroll', this.handleScroll, true); // eslint-disable-line @typescript-eslint/unbound-method

            if (this.shoppingListsList) {
                this.shoppingListsList.toggleNewListCreation(false);
                this.shoppingListsList.resetNewListForm();
            }
        }
    }

    protected applyPopupPosition(): void {
        if (!this.shoppingListsList) {
            throw new Error('AddToShoppingList: StorefrontShoppingListsList is not defined.');
        }

        if (!this.popupNode) {
            throw new Error('AddToShoppingList: ibexa-store-add-to-shopping-list__popup is not present.');
        }

        if (!this.toggleBtnNode) {
            throw new Error('AddToShoppingList: ibexa-store-add-to-shopping-list__toggler-btn is not present.');
        }

        const toggleBtnRect = this.toggleBtnNode.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const listsListScrollHeight = this.shoppingListsList.getListsListScrollHeight();

        const spaceAbove = toggleBtnRect.top;
        const spaceBelow = viewportHeight - toggleBtnRect.bottom;

        const hasSpaceBelow = spaceBelow >= listsListScrollHeight + POPUP_MARGIN;
        const hasSpaceAbove = spaceAbove >= listsListScrollHeight + POPUP_MARGIN;

        if (hasSpaceBelow || (!hasSpaceAbove && spaceBelow >= spaceAbove)) {
            this.popupNode.classList.remove('ibexa-store-add-to-shopping-list__popup--top');

            const maxHeight = Math.max(document.documentElement.clientHeight - toggleBtnRect.bottom, 0) - POPUP_MARGIN;

            this.shoppingListsList.setListsListMaxHeight(maxHeight);
        } else {
            this.popupNode.classList.add('ibexa-store-add-to-shopping-list__popup--top');

            const maxHeight = Math.max(toggleBtnRect.top, 0) - POPUP_MARGIN;

            this.shoppingListsList.setListsListMaxHeight(maxHeight);
        }
    }
}
