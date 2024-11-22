const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

router.get('/random', async (req, res) => {
  const maxPokemonId = 1000;
  const randomId1 = Math.floor(Math.random() * maxPokemonId) + 1;
  const randomId2 = Math.floor(Math.random() * maxPokemonId) + 1;

  try {
    const [response1, response2] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${randomId1}`),
      fetch(`https://pokeapi.co/api/v2/pokemon/${randomId2}`),
    ]);

    const [pokemon1, pokemon2] = await Promise.all([response1.json(), response2.json()]);
    res.json({
      pokemon1: {
        id: pokemon1.id,
        name: pokemon1.name,
        image: pokemon1.sprites.front_default || pokemon1.sprites.other['official-artwork'].front_default,
      },
      pokemon2: {
        id: pokemon2.id,
        name: pokemon2.name,
        image: pokemon2.sprites.front_default || pokemon2.sprites.other['official-artwork'].front_default,
      },
    });
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon data' });
  }
});

router.post('/vote', async (req, res) => {
  const { pokemonId, pokemonName, imageUrl } = req.body;

  if (!pokemonId || !pokemonName || !imageUrl) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const { data: existingPokemon, error: fetchError } = await supabase
      .from('pokemon')
      .select('votes_count')
      .eq('id', pokemonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let votesCount = 0;

    if (existingPokemon) {
      votesCount = existingPokemon.votes_count || 0; 
    }

    const { error: upsertError } = await supabase
      .from('pokemon')
      .upsert({
        id: pokemonId,
        pokemon_name: pokemonName,
        image_url: imageUrl,
        votes_count: votesCount + 1,
      }, { onConflict: 'id' }); 

    if (upsertError) {
      throw upsertError;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ error: 'Failed to save vote' });
  }
});




module.exports = router;
