import React from 'react';

const STYLES = [
  { id: 1, name: 'Style A', url: 'https://placehold.co/400x600/EEE/31343C?text=Style+1' },
  { id: 2, name: 'Style B', url: 'https://placehold.co/400x600/EEE/31343C?text=Style+2' },
  { id: 3, name: 'Style C', url: 'https://placehold.co/400x600/EEE/31343C?text=Style+3' }
];

const StyleSelector = ({ onSelect, selectedId }) => {
  return (
    <div className="w-full mt-6">
      <p className="text-sm font-semibold text-gray-500 mb-3 text-left uppercase tracking-wider">
        Choisir un modèle
      </p>
      <div className="grid grid-cols-3 gap-3">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
              selectedId === style.id ? 'border-blue-500 scale-95' : 'border-transparent'
            }`}
          >
            <img src={style.url} alt={style.name} className="w-full h-24 object-cover" />
            <div className="absolute bottom-0 w-full bg-black/40 py-1">
              <span className="text-[10px] text-white uppercase">{style.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
