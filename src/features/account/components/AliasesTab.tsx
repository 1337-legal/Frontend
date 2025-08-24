import React from 'react';

interface Props { aliasPanel: React.ReactNode; }

const AliasesTab: React.FC<Props> = ({ aliasPanel }) => (
    <div className="space-y-6">
        <section>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-200">Alias Management</h2>
            {aliasPanel}
        </section>
    </div>
);

export default AliasesTab;