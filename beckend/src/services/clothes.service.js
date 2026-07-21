import * as clothesRepository from "../repository/clothes.repository.js";

export const getClothes = async () => {
  return clothesRepository.findAllClothes();
};

export const getClothesById = async (id) => {
  const clothes = await clothesRepository.findClothesById(id);

  if (!clothes) {
    const error = new Error("Clothes not found");
    error.statusCode = 404;
    throw error;
  }

  return clothes;
};

export const createClothes = async (data) => {
  const { brand, size, brandcountry, price, stock,color,about } = data;

  if (!brand || !size) {
    const error = new Error("Brand and size are required");
    error.statusCode = 400;
    throw error;
  }

  return clothesRepository.createClothes({ brand, size, brandcountry, price, stock,color,about });
};
export const updateClothes = async (id, data) => {
  const existing = await clothesRepository.findClothesById(id);

  if (!existing) {
    const error = new Error("Clothes not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await clothesRepository.updateClothes(id, data);
  return updated;
};

export const deleteClothes = async (id) => {
  const existing = await clothesRepository.findClothesById(id);

  if (!existing) {
    const error = new Error("Clothes not found");
    error.statusCode = 404;
    throw error;
  }

  return clothesRepository.deleteClothes(id);
};