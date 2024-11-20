const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pokemonRoutes = require('./controllers/randomPokemon'); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());


app.use('/api/pokemon', pokemonRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
