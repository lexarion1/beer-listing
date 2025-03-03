import './polyfills';

import '@theme/base.less';
import './App';

const rootSelector = '.root';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.querySelector(rootSelector);

    if (rootElement) {
        rootElement.innerHTML = '<app-component></app-component>';
    } else {
        console.error(`Element with selector ${rootSelector} not found`);
    }
});
