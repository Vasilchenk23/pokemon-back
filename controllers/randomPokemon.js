const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

router.get('/random', async (req, res) => {
  const maxPokemonId = 404;
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
  const { pokemonId, pokemonName } = req.body;

  if (!pokemonId || !pokemonName) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const { data, error } = await supabase
      .from('pokemon')
      .insert([{ id: pokemonId, pokemon_name: pokemonName, }]);

    if (error) {
      throw error; 
    }

    res.json({ success: true, data }); 
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ error: 'Failed to save vote' });
  }
});


module.exports = router;
