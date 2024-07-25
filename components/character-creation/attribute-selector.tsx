'use client';

import React from 'react';

interface AttributeSelectorProps {
    attributes: {
        [key: string]: number;
    };
    onChange: (name: string, value: number) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({ attributes, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(name, parseInt(value, 10));
    };

    return (
        <div className="flex flex-wrap gap-4">
            {Object.entries(attributes).map(([key, value]) => (
                <label key={key} className="w-1/2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                    <input
                        type="number"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        className="ml-2"
                    />
                </label>
            ))}
        </div>
    );
};

export default AttributeSelector;
