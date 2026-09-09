import { Buffer as BufferPolyfill } from 'buffer';

declare global {
    var Buffer: typeof BufferPolyfill;
}

if (typeof globalThis.Buffer === 'undefined') {
    if (typeof BufferPolyfill?.from === 'function') {
        globalThis.Buffer = BufferPolyfill;
    } else {
        console.error(
            "Buffer polyfill unavailable: 'buffer' resolved to an empty module, so Blindflare session negotiation will fail.",
        );
    }
}
