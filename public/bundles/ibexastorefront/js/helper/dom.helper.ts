import { escapeHTML } from './text.helper';

const safelySetInnerHTML = (node: HTMLElement, text: string): void => {
    // eslint-disable-next-line no-param-reassign
    node.innerHTML = escapeHTML(text);
};

const dangerouslySetInnerHTML = (node: HTMLElement, text: string): void => {
    // eslint-disable-next-line no-param-reassign
    node.innerHTML = text;
};

const dangerouslyInsertAdjacentHTML = (node: HTMLElement, position: InsertPosition, text: string): void => {
    const escapedText = text;

    node.insertAdjacentHTML(position, escapedText);
};

const dangerouslyAppend = (node: HTMLElement, nodeOrText: Node | string): void => {
    node.append(nodeOrText);
};

const notNullQuerySelector = function <T extends HTMLElement>(node: HTMLElement | Document, selector: string): T {
    const selectedNode = node.querySelector<T>(selector);

    if (!selectedNode) {
        throw new Error(`Element for selector '${selector}' not found!`);
    }

    return selectedNode;
};

const isElement = function (target: EventTarget | null): target is Element {
    if (target === null) {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-explicit-any
    const { nodeType } = target as any;

    return typeof nodeType === 'number' && nodeType === Node.ELEMENT_NODE;
};

export { safelySetInnerHTML, dangerouslySetInnerHTML, dangerouslyInsertAdjacentHTML, dangerouslyAppend, notNullQuerySelector, isElement };
