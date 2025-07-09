import React, { useState} from 'react';
import BanList from './banList';

export default function App() {
  
  
  const [banList, setBanList] = useState(new Set());
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  

  
  const MAX_POKEMON = 898;
  async function fetchRandomPokemon(banList, maxTries = 1000) {
    let attempts = 0;
    while (attempts < maxTries) {
      attempts++;
      const id = Math.ceil(Math.random() * MAX_POKEMON);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) continue;
        const data = await res.json();
        const types = data.types.map(t => t.type.name);
        // skip if any type banned
        
        if (types.some(t => banList.has(t))) continue;

        const basicAttack = data.moves[0]?.move.name || 'Tackle';


        return {
          name: data.name,
          types,
          basicAttack,
          sprite: data.sprites.front_default
        };
      } catch {
        continue;
      }
    }
    return null; // gave up
  }

  // 4. Button handler
  async function handleDiscover() {
    

    setLoading(true);
    const result = await fetchRandomPokemon(banList);
    setLoading(false);

    if (!result) {
      alert('Couldn’t find a Pokémon outside your banned types.');
      return;
    }
    setPokemon(result);
  }

  // 5. Toggle ban/unban
  function toggleBan(type) {
    setBanList(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  }

  
  return (
    <div style={{ padding: '1rem' }}>
  
      <h1>RandomDex</h1>
      <p>Press the discover button to find different pokemon, filter by type</p>


      <button onClick={handleDiscover} disabled={loading}>
        {loading ? 'Loading…' : 'Discover'}
      </button>

      

      {pokemon && (
        <div style={{ marginTop: '1rem' }}>
          <img src={pokemon.sprite} alt={pokemon.name} />
          <div>Name: {pokemon.name}</div>
          {pokemon.types.map(t => (
            <div
              key={t}
              onClick={() => toggleBan(t)}
              style={{
                display: 'inline-block',
                margin: '0.25rem',
                padding: '0.25rem 0.5rem',
                background: banList.has(t) ? 'pink' : '#eee',
                cursor: 'pointer'
              }}
            >
              Type: {t}
            </div>
          ))}
          <div>Base Attack: {pokemon.basicAttack}</div>
        </div>
      )}

      <BanList banList={banList} toggleBan={toggleBan} />

    </div>
  );
}