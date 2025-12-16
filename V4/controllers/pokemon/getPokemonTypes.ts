import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import logger from "../../../utils/logger/logger";
import pokemonTypes from "../../../utils/pokeUtils/pokemonTypeData";

const getPokemonTypes = asyncHandler(async (req: Request, res: Response) => {
  try {
    res.json({
      data: pokemonTypes,
    });
  } catch (error) {
    res.status(500).json(error);
    logger.logError("get all pokemon", error);
  }
});

export default getPokemonTypes;
