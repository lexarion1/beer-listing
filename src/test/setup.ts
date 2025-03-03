import { vi } from 'vitest';

// Mock CSS Modules: any import ending with .module.less returns a proxy object
vi.mock('*.module.less', () => ({
    default: new Proxy(
        {},
        {
            get: (_, prop) => {
                if (typeof prop === 'string') {
                    return prop;
                }

                return undefined;
            },
        }
    ),
}));

vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        takeRecords: vi.fn(),
        unobserve: vi.fn(),
    }))
);
