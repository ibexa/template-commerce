import { dangerouslyInsertAdjacentHTML, notNullQuerySelector } from './helper/dom.helper';
import { escapeHTML } from './helper/text.helper';

declare global {
    interface GlobalEventHandlersEventMap {
        'ibexa-store-notify': CustomEvent<NotificationDetail>;
    }
}

export interface NotificationDetail {
    onShow?: (node: HTMLElement) => void;
    label: string | null;
    message: string | null;
    type?: string;
}

type NotificationMessages = Record<string, string[]>;

const isEmptyArray = (value: unknown): value is [] => {
    return value instanceof Array && value.length === 0;
};

const isNotificationMessages = (value: unknown): value is NotificationMessages => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    if (!isRecord(value)) {
        return false;
    }

    return Object.values(value).every((val) => Array.isArray(val) && val.every((item) => typeof item === 'string'));
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

(function (global: Window, doc: Document) {
    const notificationsContainer = notNullQuerySelector<HTMLElement>(doc, '.ibexa-store-notifications-container');
    const parsedNotifications: unknown = notificationsContainer.dataset.notifications
        ? JSON.parse(notificationsContainer.dataset.notifications)
        : null;

    if (!isNotificationMessages(parsedNotifications) && !isEmptyArray(parsedNotifications)) {
        throw new Error('store.notifications: invalid notifications data format');
    }

    const notifications: NotificationMessages = isEmptyArray(parsedNotifications) ? {} : parsedNotifications;
    const { template } = notificationsContainer.dataset;

    if (!template) {
        throw new Error('store.notifications: template not provided!');
    }

    const handleClose = (event: MouseEvent) => {
        const target = event.currentTarget;

        if (!target || !(target instanceof HTMLElement)) {
            return;
        }

        const notification = target.closest<HTMLElement>('.ibexa-store-notification');

        if (notification) {
            notification.remove();
        }
    };
    const addNotification = (event: CustomEvent<NotificationDetail>) => {
        const { onShow, label, message, type = 'error' } = event.detail;
        const container = doc.createElement('div');

        const labelEscaped = escapeHTML(label ?? '');
        const messageEscaped = escapeHTML(message ?? '');
        const notification = template.replace('{{ label }}', labelEscaped).replace('{{ message }}', messageEscaped);

        dangerouslyInsertAdjacentHTML(container, 'beforeend', notification);

        const notificationNode = notNullQuerySelector<HTMLElement>(container, '.ibexa-store-notification');
        const notificationCloseBtn = notNullQuerySelector<HTMLButtonElement>(notificationNode, '.ibexa-store-notification__close-btn');

        notificationCloseBtn.addEventListener('click', handleClose, false);
        notificationNode.classList.add(`ibexa-store-notification--${type}`);

        notificationsContainer.append(notificationNode);

        if (typeof onShow === 'function') {
            onShow(notificationNode);
        }
    };

    Object.entries(notifications).forEach(([label, messages]) => {
        messages.forEach((message) => {
            addNotification(new CustomEvent('ibexa-store-notify', { detail: { label: '', message, type: label } }));
        });
    });

    doc.body.addEventListener(
        'ibexa-store-notify',
        (event) => {
            addNotification(event);
        },
        false,
    );
})(window, window.document);
