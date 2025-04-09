import Summary from '@ibexa-cart/src/bundle/Resources/public/js/component/summary';
import { errorHandler } from '../helper/error.helper';

const STATUS_NOT_FOUND = 404;
export default class StorefrontSummary extends Summary {
    constructor(options) {
        super(options);

        this.summaryDiscountNode = this.summaryNode.querySelector('.ibexa-store-maincart-summary__item--discount');
        this.summaryCouponsContainer = this.summaryNode.querySelector('.ibexa-store-maincart-summary__coupons-container');

        this.isCouponEnabled = !!this.summaryCouponsContainer;

        this.couponInputContainerNode = this.summaryCouponsContainer?.querySelector(
            '.ibexa-store-maincart-summary-coupon__input-container',
        );
        this.couponInputNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__input') ?? null;
        this.couponApplyBtnNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__apply-btn') ?? null;
        this.couponInputErrorNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__error') ?? null;
        this.couponCouponNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__coupon') ?? null;
        this.couponBadgeNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__discount-badge') ?? null;
        this.couponInfoNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__info') ?? null;
        this.couponRemoveBtnNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__remove-btn') ?? null;

        this.handleCouponAdd = this.handleCouponAdd.bind(this);
        this.handleCouponRemove = this.handleCouponRemove.bind(this);
    }

    attachSummaryListeners() {
        super.attachSummaryListeners(...arguments);

        if (this.isCouponEnabled) {
            this.couponApplyBtnNode.addEventListener('click', this.handleCouponAdd, false);
            this.couponInputNode.addEventListener(
                'keydown',
                (event) => {
                    if (event.key === 'Enter') {
                        this.handleCouponAdd();
                    }
                },
                false,
            );
            this.couponRemoveBtnNode.addEventListener('click', this.handleCouponRemove, false);
        }
    }

    async handleCouponAdd() {
        const { errorInfoCouponNotFound, errorInfoGeneralError } = this.couponInputNode.dataset;

        this.toggleCouponInputDisabledState(true);

        try {
            const { response: couponResponse, cartLoaded } = await this.cart.addCoupon(this.couponInputNode.value);

            if (!couponResponse.ok) {
                if (couponResponse.status === STATUS_NOT_FOUND) {
                    this.toggleCouponInputErrorState(true, errorInfoCouponNotFound);
                } else {
                    this.toggleCouponInputErrorState(true, errorInfoGeneralError);
                }

                return;
            }

            const { cartSummaryLoaded } = await cartLoaded;
            const { CartSummary } = await cartSummaryLoaded;

            const isAnyCouponApplied = CartSummary.SummaryEntryCollection.SummaryEntry.some((summaryEntry) => {
                const lastPriceStamp = summaryEntry.Price.RestPrice.Price.PriceStamps.at(-1) ?? null;
                const isCouponApplied = lastPriceStamp?.isDiscountCodeAware ?? false;

                return isCouponApplied;
            });

            if (isAnyCouponApplied) {
                this.toggleCouponInputErrorState(false);
            } else {
                this.toggleCouponInputErrorState(true, errorInfoCouponNotFound);
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    handleCouponRemove() {
        this.couponRemoveBtnNode.disabled = true;

        const appliedCoupon = this.getAppliedCoupon();

        this.cart.removeCoupon(appliedCoupon.code);
    }

    getAppliedCoupon() {
        const { cartData } = this.cart;
        const cartDiscountCode = cartData.context?.cart_discount_code ?? null;

        if (!cartDiscountCode) {
            return null;
        }

        const summary = this.cart.getCartSummary();

        for (const summaryEntry of summary.SummaryEntryCollection.SummaryEntry) {
            const lastPriceStamp = summaryEntry.Price.RestPrice.Price.PriceStamps.at(-1) ?? null;

            if (!lastPriceStamp || !lastPriceStamp.isDiscountCodeAware) {
                continue;
            }

            const discountValue = lastPriceStamp.discountValue ?? null;

            if (discountValue) {
                return {
                    code: cartDiscountCode,
                    discountValue,
                };
            }
        }

        return null;
    }

    insertSummaryDiscountData() {
        if (!this.summaryDiscountNode) {
            return;
        }

        const summary = this.cart.getCartSummary();
        const discountPriceFormatted = summary.TotalDiscount?.RestPrice.formatted ?? null;
        const totalDiscount = discountPriceFormatted ? `-${discountPriceFormatted}` : '0';
        const discountValueNode = this.summaryDiscountNode.querySelector('.ibexa-crt-summary__item-value');

        discountValueNode.innerText = totalDiscount;
    }

    toggleCouponInputErrorState(hasError, errorMessage = '') {
        this.couponInputErrorNode.innerText = errorMessage;

        this.couponInputNode.classList.toggle('ibexa-store-maincart-summary-coupon__input--error', hasError);
    }

    toggleCouponInputDisabledState(isDisabled) {
        this.couponApplyBtnNode.disabled = isDisabled;
        this.couponInputNode.disabled = isDisabled;
    }

    resetCouponInput() {
        this.couponInputNode.value = '';
    }

    insertCouponData(appliedCoupon) {
        const couponInfo = appliedCoupon.discountValue;
        const couponCode = appliedCoupon.code;

        this.couponInfoNode.innerText = couponInfo;
        this.couponBadgeNode.innerText = couponCode;
        this.couponRemoveBtnNode.disabled = false;
    }

    insertSummaryCouponData(appliedCoupon) {
        const isCouponApplied = !!appliedCoupon;

        if (isCouponApplied) {
            this.insertCouponData(appliedCoupon);
            this.resetCouponInput();
        } else {
            this.toggleCouponInputDisabledState(false);
        }

        this.couponInputContainerNode.classList.toggle('ibexa-store-maincart-summary-coupon__input-container--visible', !isCouponApplied);
        this.couponCouponNode.classList.toggle('ibexa-store-maincart-summary-coupon__coupon--visible', isCouponApplied);
    }

    insertSummaryData() {
        super.insertSummaryData(...arguments);

        this.insertSummaryDiscountData();

        if (this.isCouponEnabled) {
            const appliedCoupon = this.getAppliedCoupon();

            this.insertSummaryCouponData(appliedCoupon);
        }
    }
}
