import {
    ShoppingListItem,
    ShoppingListOperationConfig,
    ShoppingListsList,
} from '@ibexa-shopping-list/src/bundle/Resources/public/js/component/shopping.lists.list';
import { NotificationDetail } from '../store.notifications';

export const checkIsCanCreateShoppingList = (value: unknown): value is undefined | 'data-can-create-shopping-list' => {
    return value === undefined || (typeof value === 'string' && value === 'data-can-create-shopping-list');
};

export const checkIsShoppingListLimit = (value: unknown): value is string => {
    return typeof value === 'string' && /^[0-9]+$/.test(value);
};

export class StorefrontShoppingListsList extends ShoppingListsList {
    private canCreateShoppingList: boolean;
    private canCreateShoppingListErrorMessage: string | null;

    private shoppingListLimit: number;
    private shoppingListLimitErrorMessage: string | null;

    private defaultBadgeText: string;

    constructor(config: ShoppingListOperationConfig) {
        super(config);

        const {
            canCreateShoppingList,
            canCreateShoppingListErrorMessage,
            shoppingListLimit,
            shoppingListLimitErrorMessage,
            defaultBadgeText,
        } = this.node.dataset;

        if (checkIsCanCreateShoppingList(canCreateShoppingList)) {
            this.canCreateShoppingList = canCreateShoppingList === 'data-can-create-shopping-list';
        } else {
            throw new Error('AddToShoppingList: wrong data-can-create-shopping-list provided');
        }

        if (checkIsShoppingListLimit(shoppingListLimit)) {
            this.shoppingListLimit = parseInt(shoppingListLimit, 10);
        } else {
            throw new Error('AddToShoppingList: wrong shopping list limit provided');
        }

        if (!defaultBadgeText) {
            throw new Error('StorefrontShoppingListsList: data-default-badge-text not defined');
        }

        this.canCreateShoppingListErrorMessage = canCreateShoppingListErrorMessage ?? null;
        this.shoppingListLimitErrorMessage = shoppingListLimitErrorMessage ?? null;
        this.defaultBadgeText = defaultBadgeText;
    }

    checkCanCreateNewList(...args: Parameters<ShoppingListsList['checkCanCreateNewList']>) {
        const superResult = super.checkCanCreateNewList(...args);

        if (!superResult.canCreateNewList) {
            return superResult;
        }

        if (!this.canCreateShoppingList) {
            return {
                canCreateNewList: false,
                message: this.canCreateShoppingListErrorMessage,
            };
        }

        if (!window.ibexaShoppingList) {
            throw new Error('AddToShoppingList: window.ibexaShoppingList not defined');
        }

        const shoppingLists = window.ibexaShoppingList.getShoppingLists()?.ShoppingList ?? [];

        if (shoppingLists.length >= this.shoppingListLimit) {
            return {
                canCreateNewList: false,
                message: this.shoppingListLimitErrorMessage,
            };
        }

        return {
            canCreateNewList: true,
            message: null,
        };
    }

    protected handleCannotCreateNewList(message: string | null) {
        document.body.dispatchEvent(
            new CustomEvent<NotificationDetail>('ibexa-store-notify', {
                detail: { label: null, message, type: 'error' },
            }),
        );
    }

    protected validateNewListName(...args: Parameters<ShoppingListsList['validateNewListName']>) {
        const superData = super.validateNewListName(...args);
        const { isInvalid } = superData;

        this.newListNameInputNode.classList.toggle('ibexa-store-input--invalid', isInvalid);

        return superData;
    }

    protected onListItemInserted(item: ShoppingListItem, itemNode: HTMLElement) {
        super.onListItemInserted(item, itemNode);

        if (item.isDefault) {
            itemNode.classList.add('ibexa-store-shopping-lists-list-item--default');

            const labelNode = this.getListItemLabel(itemNode);
            const defaultBadge = document.createElement('span');

            defaultBadge.className = 'ibexa-store-shopping-lists-list-item__default-badge';
            defaultBadge.textContent = this.defaultBadgeText;

            labelNode.appendChild(defaultBadge);
        }
    }
}
