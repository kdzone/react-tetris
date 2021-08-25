import React from 'react';

//***
const ScopePanel = ({ env }) => {
  return (
    <div className="info">
      <div>
        Level:<span>{env.level}</span>
      </div>
      <div>
        Scope:<span>{env.model.scope}</span>
      </div>
      {/*
            <div className="font-sm">
                rows:<span>{model.lineCount}</span>
            </div>
            <div className="font-sm">
                figs:<span>{model.figCount}</span>
            </div>
            */}
    </div>
  );
};

export default ScopePanel;
