import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import capitalize from "../../../utils/capitalize";
import logger from "../../../utils/logger/logger";
import pokemonData from "../../../utils/pokeUtils/pokemonData";

const getAllPokemons = asyncHandler(async (req: Request, res: Response) => {
  try {
    let page: any = req.query.page ? parseInt(req.query.page as string) : 1;
    let q: any = req.query.q;
    let per_page: any = req.query.per_page
      ? parseInt(req.query.per_page as string)
      : 8;
    let type: any = req.query.type;
    let sort: any = req.query.sort;
    let order: any = req.query.order || "asc";

    const IP = process.env.IP;
    let nextLink: string | null = null;
    let data: typeof pokemonData = [];
    let total = 0;
    if (q) {
      data = pokemonData.filter((d) =>
        d.name.english.toLowerCase().includes(q.toLowerCase())
      );
    } else {
      data = pokemonData;
    }
    if (type) {
      // Support multiple types separated by commas
      const typeArray = (type as string)
        .split(",")
        .map((t) => capitalize(t.trim()))
        .filter((t) => t);
      if (typeArray.length > 0) {
        data = data.filter((d) =>
          typeArray.some((filterType) => d.type.includes(filterType))
        );
      }
    }

    // Apply sorting
    if (sort) {
      const sortOrder = order.toLowerCase() === "desc" ? -1 : 1;
      data.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.toLowerCase()) {
          case "id":
            aValue = a.id;
            bValue = b.id;
            break;
          case "name":
            aValue = a.name.english.toLowerCase();
            bValue = b.name.english.toLowerCase();
            break;
          case "hp":
            aValue = a.base?.HP ?? 0;
            bValue = b.base?.HP ?? 0;
            break;
          case "attack":
            aValue = a.base?.Attack ?? 0;
            bValue = b.base?.Attack ?? 0;
            break;
          case "defense":
            aValue = a.base?.Defense ?? 0;
            bValue = b.base?.Defense ?? 0;
            break;
          case "spattack":
            aValue = a.base?.["Sp. Attack"] ?? 0;
            bValue = b.base?.["Sp. Attack"] ?? 0;
            break;
          case "spdefense":
            aValue = a.base?.["Sp. Defense"] ?? 0;
            bValue = b.base?.["Sp. Defense"] ?? 0;
            break;
          case "speed":
            aValue = a.base?.Speed ?? 0;
            bValue = b.base?.Speed ?? 0;
            break;
          case "total":
            aValue =
              (a.base?.HP ?? 0) +
              (a.base?.Attack ?? 0) +
              (a.base?.Defense ?? 0) +
              (a.base?.["Sp. Attack"] ?? 0) +
              (a.base?.["Sp. Defense"] ?? 0) +
              (a.base?.Speed ?? 0);
            bValue =
              (b.base?.HP ?? 0) +
              (b.base?.Attack ?? 0) +
              (b.base?.Defense ?? 0) +
              (b.base?.["Sp. Attack"] ?? 0) +
              (b.base?.["Sp. Defense"] ?? 0) +
              (b.base?.Speed ?? 0);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      });
    }

    total = data.length;
    data = data.slice((page - 1) * per_page, page * per_page);
    if (total > page * per_page) {
      const typeParam = type ? encodeURIComponent(type as string) : "";
      nextLink = `http://localhost:5000/v3/pokemon?page=${page + 1}&q=${
        q || ""
      }&type=${typeParam}&sort=${sort || ""}&order=${order}`;
    }
    res.json({
      data,
      total,
      next: nextLink,
    });
  } catch (error) {
    res.status(500).json(error);
    logger.logError("get all pokemon", error);
  }
});

export default getAllPokemons;
