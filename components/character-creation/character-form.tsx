'use client';

import React from 'react';
import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import CharacterDetails from '../character-creation/character-details';
import AttributeSelector from '../character-creation/attribute-selector';
import Summary from '../character-creation/summary';
import { Character, initialAttributes } from '@/lib/types';
import '@/app/styles.css';

interface CharacterFormProps {
    characterData: Character;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ characterData }) => {
    const [character, setCharacter] = useState<Character>({
        name: characterData.name || '',
        race: characterData.race || '',
        class: characterData.class || '',
        attributes: characterData.attributes || initialAttributes,
    });

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCharacter({ ...character, [name]: value });
    };

    const handleAttributesChange = (name: string, value: number) => {
        setCharacter({
            ...character,
            attributes: { ...character.attributes, [name]: value },
        });
    };

    return (
        <Tabs.Root className="TabsRoot" defaultValue="tab1">
            <Tabs.List className="TabsList" aria-label="Character Creation">
                <Tabs.Trigger className="TabsTrigger" value="tab1">
                    Character Details
                </Tabs.Trigger>
                <Tabs.Trigger className="TabsTrigger" value="tab2">
                    Summary
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="tab1">
                <form className="bg-black flex flex-col gap-4">
                    <CharacterDetails character={character} onChange={handleDetailsChange} />
                    <AttributeSelector attributes={character.attributes} onChange={handleAttributesChange} />
                </form>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="tab2">
                <Summary character={character} />
            </Tabs.Content>
        </Tabs.Root>
    );
};

export default CharacterForm;
