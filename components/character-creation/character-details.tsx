'use client';

import React from 'react';
import { Character } from '@/lib/types';

interface CharacterDetailsProps {
    character: Pick<Character, 'name' | 'race' | 'class'>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ character, onChange }) => {
    return (
        <div>
            <label>
                Name:
                <input type="text" name="name" value={character.name} onChange={onChange} />
            </label>
            <label>
                Race:
                <select name="race" value={character.race} onChange={onChange}>
                    <option value="">Select Race</option>
                    <option value="Human">Human</option>
                    <option value="Elf">Elf</option>
                    <option value="Dwarf">Dwarf</option>
                    <option value="Orc">Orc</option>
                </select>
            </label>
            <label>
                Class:
                <select name="class" value={character.class} onChange={onChange}>
                    <option value="">Select Class</option>
                    <option value="Warrior">Warrior</option>
                    <option value="Mage">Mage</option>
                    <option value="Rogue">Rogue</option>
                    <option value="Cleric">Cleric</option>
                </select>
            </label>
        </div>
    );
};

export default CharacterDetails;
