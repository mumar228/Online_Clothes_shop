import { AppDataSource } from "../config/data-sorce.js";
import { ClothesEntity } from "../models/clothes.entity.js";

const clothesRepo = AppDataSource.getRepository(ClothesEntity);

export const findAllClothes = async () => {
  return clothesRepo.find({ order: { id: "DESC" } });
};

export const findClothesById = async (id) => {
  return clothesRepo.findOneBy({ id });
};

export const createClothes = async ({ brand, size, brandcountry, price, stock, color, about, image }) => {
  const clothes = clothesRepo.create({ brand, size, brandcountry, price, stock, color, about, image });
  return clothesRepo.save(clothes);
};

export const updateClothes = async (id, data) => {
  const clothes = await clothesRepo.findOneBy({ id });

  if (!clothes) return null;

  clothesRepo.merge(clothes, data);
  return clothesRepo.save(clothes);
};

export const deleteClothes = async (id) => {
  const clothes = await clothesRepo.findOneBy({ id });

  if (!clothes) return null;

  await clothesRepo.remove(clothes);
  return clothes;
};