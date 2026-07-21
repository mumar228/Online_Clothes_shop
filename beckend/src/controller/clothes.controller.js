import * as clothesService from "../services/clothes.service.js";

export const getClothes = async (req, res, next) => {
  try {
    const clothes = await clothesService.getClothes();
    res.json(clothes);
  } catch (error) {
    next(error);
  }
};

export const getClothesById = async (req, res, next) => {
  try {
    const clothes = await clothesService.getClothesById(Number(req.params.id));
    res.json(clothes);
  } catch (error) {
    next(error);
  }
};

export const createClothes = async (req, res, next) => {
  try {
    const clothes = await clothesService.createClothes(req.body);
    res.status(201).json(clothes);
  } catch (error) {
    next(error);
  }
};
export const updateClothes = async (req, res, next) => {
  try {
    const clothes = await clothesService.updateClothes(Number(req.params.id), req.body);
    res.json(clothes);
  } catch (error) {
    next(error);
  }
};

export const deleteClothes = async (req, res, next) => {
  try {
    await clothesService.deleteClothes(Number(req.params.id));
    res.status(200).json({ message: "Clothes deleted successfully" });
  } catch (error) {
    next(error);
  }
};
