import * as cartService from '@ibexa-cart/src/bundle/Resources/public/js/service/cart';

export const addCoupon = (cartIdentifier, coupon) => {
    const request = cartService.prepareRequest(
        `/api/ibexa/v2/discounts_codes/${cartIdentifier}/apply`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.DiscountCode+json',
                Accept: 'application/vnd.ibexa.api.DiscountCode+json',
            },
            body: JSON.stringify({
                DiscountCode: {
                    code: coupon,
                },
            }),
        },
        'ibexa-rest-cart_coupon-add',
    );

    return fetch(request);
};

export const removeCoupon = (cartIdentifier, coupon) => {
    const request = cartService.prepareRequest(
        `/api/ibexa/v2/discounts_codes/${cartIdentifier}/drop`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.ibexa.api.DiscountCode+json',
                Accept: 'application/vnd.ibexa.api.DiscountCode+json',
            },
            body: JSON.stringify({
                DiscountCode: {
                    code: coupon,
                },
            }),
        },
        'ibexa-rest-cart_coupon-drop',
    );

    return fetch(request).then((response) => cartService.handleRequest(response));
};
