import Summary from '@ibexa-cart/src/bundle/Resources/public/js/component/summary';
import { errorHandler } from '../helper/error.helper';

const STATUS_NOT_FOUND = 404;
const DISCOUNT_INFOS_TOGGLER_LIMIT = 2;
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
        this.couponBadgeNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-discount-badge') ?? null;
        this.couponInfoNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-discount-info__description') ?? null;
        this.couponRemoveBtnNode = this.summaryCouponsContainer?.querySelector('.ibexa-store-maincart-summary-coupon__remove-btn') ?? null;

        this.discountInfoContainer = this.summaryNode.querySelector('.ibexa-store-maincart-summary__discounts-info-container');
        this.discountInfoToggler = this.summaryNode.querySelector('.ibexa-store-maincart-summary__discounts-info-toggler');

        this.handleCouponAdd = this.handleCouponAdd.bind(this);
        this.handleCouponRemove = this.handleCouponRemove.bind(this);
        this.handleDiscountsInfosTogglerBtnClick = this.handleDiscountsInfosTogglerBtnClick.bind(this);
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

        if (this.discountInfoToggler) {
            this.discountInfoToggler.addEventListener('click', this.handleDiscountsInfosTogglerBtnClick, false);
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

    handleDiscountsInfosTogglerBtnClick() {
        const isCollapsed = this.discountInfoToggler.classList.contains('ibexa-store-maincart-summary__discounts-info-toggler--collapsed');
        const discountInfos = [...this.discountInfoContainer.children];

        this.discountInfoToggler.classList.toggle('ibexa-store-maincart-summary__discounts-info-toggler--collapsed', !isCollapsed);

        if (isCollapsed) {
            discountInfos.forEach((discountInfo) => {
                discountInfo.classList.remove('ibexa-store-maincart-summary__discounts-info--hidden');
            });
        } else {
            const discountInfosToHide = discountInfos.slice(DISCOUNT_INFOS_TOGGLER_LIMIT - discountInfos.length);

            discountInfosToHide.forEach((discountInfo) => {
                discountInfo.classList.add('ibexa-store-maincart-summary__discounts-info--hidden');
            });
        }
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

    insertSummaryDiscountInfos() {
        if (!this.discountInfoContainer) {
            return;
        }

        const { discountInfoTemplate } = this.discountInfoContainer.dataset;
        const fragment = document.createDocumentFragment();
        const summary = this.cart.getCartSummary();
        const appliedDiscountsDataMap = summary.SummaryEntryCollection.SummaryEntry.reduce((discountsMap, summaryEntry) => {
            const lastPriceStamp = summaryEntry.Price.RestPrice.Price.PriceStamps.at(-1) ?? null;

            if (!lastPriceStamp || lastPriceStamp.isDiscountCodeAware || !lastPriceStamp.discountValue) {
                return discountsMap;
            }

            const {
                discountValue,
                Discount: { id, label, labelDescription },
            } = lastPriceStamp;

            return {
                ...discountsMap,
                [id]: { discountValue, label, labelDescription },
            };
        }, {});

        Object.values(appliedDiscountsDataMap).forEach(({ discountValue, label, labelDescription }) => {
            const container = document.createElement('div');
            const renderedItemTemplate = discountInfoTemplate
                .replace('{{ badge_content }}', discountValue)
                .replace('{{ name }}', label ?? '')
                .replace('{{ description }}', labelDescription ?? '');

            container.insertAdjacentHTML('beforeend', renderedItemTemplate);

            const discountInfoNode = container.querySelector('.ibexa-store-discount-info');

            if (!labelDescription) {
                discountInfoNode.classList.add('ibexa-store-discount-info--no-description');

                const descriptionNode = discountInfoNode.querySelector('.ibexa-store-discount-info__description');

                descriptionNode.remove();
            }

            fragment.append(discountInfoNode);
        });

        this.discountInfoContainer.innerHTML = null;
        this.discountInfoContainer.appendChild(fragment);
    }

    updateDiscountsInfosTogglerBtnState() {
        const discountInfos = [...this.discountInfoContainer.children];
        const isTogglerVisible = discountInfos.length > DISCOUNT_INFOS_TOGGLER_LIMIT;

        this.discountInfoToggler.classList.toggle('ibexa-store-maincart-summary__discounts-info-toggler--hidden', !isTogglerVisible);

        if (isTogglerVisible) {
            this.discountInfoToggler.classList.add('ibexa-store-maincart-summary__discounts-info-toggler--collapsed');

            const discountInfosToHide = discountInfos.slice(DISCOUNT_INFOS_TOGGLER_LIMIT - discountInfos.length);

            discountInfosToHide.forEach((discountInfo) => {
                discountInfo.classList.add('ibexa-store-maincart-summary__discounts-info--hidden');
            });
        }
    }

    insertSummaryData() {
        super.insertSummaryData(...arguments);

        this.insertSummaryDiscountData();

        this.insertSummaryDiscountInfos();
        this.updateDiscountsInfosTogglerBtnState();

        if (this.isCouponEnabled) {
            const appliedCoupon = this.getAppliedCoupon();

            this.insertSummaryCouponData(appliedCoupon);
        }
    }
}
