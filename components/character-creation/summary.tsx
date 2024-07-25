'use client';

// components/Summary.tsx
import React from 'react';
import { Character } from '@/lib/types';

interface SummaryProps {
    character: Character;
}

const Summary: React.FC<SummaryProps> = ({ character }) => {
    return (
        <div>
            <h3>Character Summary</h3>
            <p>Name: {character.name}</p>
            <p>Race: {character.race}</p>
            <p>Class: {character.class}</p>
            <h4>Attributes</h4>
            <ul>
                {Object.entries(character.attributes).map(([key, value]) => (
                    <li key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Summary;
