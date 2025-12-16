import express from "express";
import getAllPokemons from "../controllers/pokemon/getAllPokemons";
import getPokemonTypes from "../controllers/pokemon/getPokemonTypes";
import { authMiddleware } from "../../middleware/authMiddleware";

const v4pokemonRoutes = express.Router();

v4pokemonRoutes.get("/", authMiddleware, getAllPokemons);
v4pokemonRoutes.get("/types", authMiddleware, getPokemonTypes);

export default v4pokemonRoutes;
