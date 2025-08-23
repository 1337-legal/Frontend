// filepath: c:\Users\Sierra\Documents\Projects\1337.legal\Frontend\src\features\auth\components\CodeBlock.tsx
import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="w-full overflow-x-auto rounded-md border border-neutral-800 bg-neutral-950/60 p-4 text-sm leading-relaxed text-neutral-300">
        <code>{children}</code>
    </pre>
);

export default CodeBlock;