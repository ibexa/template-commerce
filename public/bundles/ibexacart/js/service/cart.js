export const prepareRequest = (url, requestOptions, requestIdentifier) => {
    const token = document.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = document.querySelector('meta[name="SiteAccess"]').content;
    const request = new Request(url, {
        mode: 'same-origin',
        credentials: 'same-origin',
        ...requestOptions,
        headers: {
            'X-Siteaccess': siteaccess,
            'X-CSRF-Token': token,
            ...requestOptions.headers,
        },
    });
    const detail = {
        requestIdentifier,
        request,
    };

    document.dispatchEvent(new CustomEvent('ibexa-cart:prepare-request', { detail }));

    return detail.request;
};

const hasHttpErrorFlag = (value) => {
    return typeof value === 'object' && value !== null && 'isHttpError' in value && value.isHttpError;
};

export const checkIsHttpError = (error) => {
    return error instanceof Error && hasHttpErrorFlag(error);
};

export class HttpError extends Error {
    isHttpError = true;

    constructor(response) {
        super(`HTTP Error ${response.status}: ${response.statusText}`);

        this.name = 'HttpError';
        this.response = response;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const handleRequest = (response) => {
    if (!response.ok) {
        throw new HttpError(response);
    }

    return response;
};

export const authorize = () => {
    const request = prepareRequest(
        '/api/ibexa/v2/cart/authorize',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.CartViewInput+json',
                Accept: 'application/json',
            },
        },
        'ibexa-rest-cart-cart_authorize',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const loadUserCarts = (ownerId) => {
    const request = prepareRequest(
        '/api/ibexa/v2/cart/view',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.CartViewInput+json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                CartViewInput: {
                    identifier: 'loadUserCarts',
                    CartQuery: {
                        offset: 0,
                        limit: 10,
                        ownerId: ownerId,
                    },
                },
            }),
        },
        'ibexa-rest-cart-cart_view',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const loadCart = (cartIdentifier) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.CartViewInput+json',
                Accept: 'application/json',
            },
        },
        'ibexa-rest-cart-get',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const loadCartSummary = (cartIdentifier) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/summary`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.ibexa.api.ShortCartSummary+json',
            },
        },
        'ibexa-rest-cart-summary',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const createCart = (currencyCode) => {
    const request = prepareRequest(
        '/api/ibexa/v2/cart',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.CartCreate+json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                CartCreate: {
                    name: 'Default',
                    currencyCode,
                },
            }),
        },
        'ibexa-rest-cart-create',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const deleteCart = (cartIdentifier) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}`,
        {
            method: 'DELETE',
        },
        'ibexa-rest-cart-delete',
    );

    return fetch(request);
};

export const createCartEntry = (cartIdentifier, productCode, quantity, context = {}) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/entry`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.CartEntryAdd+json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                CartEntryAdd: {
                    quantity,
                    Product: {
                        code: productCode,
                    },
                    context,
                },
            }),
        },
        'ibexa-rest-cart-cart_entry-add',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const updateProductQuantity = (cartIdentifier, entryIdentifier, quantity, context = {}) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/entry/${entryIdentifier}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.CartEntryUpdate+json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                CartEntryUpdate: {
                    quantity,
                    context,
                },
            }),
        },
        'ibexa-rest-cart-cart_entry-update',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const deleteCartEntry = (cartIdentifier, entryIdentifier) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/entry/${entryIdentifier}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        },
        'ibexa-rest-cart_entry-remove',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const emptyCart = (cartIdentifier) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/empty`,
        {
            method: 'POST',
        },
        'ibexa-rest-cart-empty',
    );

    return fetch(request).then(handleRequest);
};

export const moveToShoppingList = (cartIdentifier) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/move-to-shopping-list`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.ibexa.api.ShoppingList+json',
                'Content-Type': 'application/json',
            },
        },
        'ibexa-rest-cart-cart_entry-update',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};

export const moveEntriesToShoppingList = (cartIdentifier, entriesIdentifiers) => {
    const request = prepareRequest(
        `/api/ibexa/v2/cart/${cartIdentifier}/move-entries-to-shopping-list`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.ibexa.api.ShoppingList+json',
                'Content-Type': 'application/vnd.ibexa.api.CartEntryIdentifiers+json',
            },
            body: JSON.stringify({
                CartEntryIdentifiers: {
                    entries: entriesIdentifiers.map((entryIdentifier) => ({
                        identifier: entryIdentifier,
                    })),
                },
            }),
        },
        'ibexa-rest-cart-move-entries-to-shopping-list',
    );

    return fetch(request).then((response) => handleRequest(response).json());
};
