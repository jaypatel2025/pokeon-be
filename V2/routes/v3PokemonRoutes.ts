import express from "express";
import getAllPokemons from "../controllers/pokemon/getAllPokemons";
import getPokemonTypes from "../controllers/pokemon/getPokemonTypes";

const v3pokemonRoutes = express.Router();

v3pokemonRoutes.get("/", getAllPokemons);
v3pokemonRoutes.get("/types", getPokemonTypes);

export default v3pokemonRoutes;
