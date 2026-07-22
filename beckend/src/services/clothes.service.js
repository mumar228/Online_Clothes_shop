import * as clothesRepository from "../repository/clothes.repository.js";
import fs from "fs";
import path from "path";

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

export const createClothes = async (data, imagePath) => {
  const { brand, size, brandcountry, price, stock, color, about } = data;

  if (!brand || !size) {
    const error = new Error("Brand and size are required");
    error.statusCode = 400;
    throw error;
  }

  return clothesRepository.createClothes({
    brand,
    size,
    brandcountry,
    price,
    stock,
    color,
    about,
    image: imagePath,
  });
};

export const updateClothes = async (id, data, imagePath) => {
  const existing = await clothesRepository.findClothesById(id);

  if (!existing) {
    const error = new Error("Clothes not found");
    error.statusCode = 404;
    throw error;
  }

  // Agar yangi rasm yuklangan bo'lsa, eskisini o'chiramiz
  if (imagePath && existing.image) {
    const oldImagePath = path.join(".", existing.image);
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Eski rasmni o'chirishda xatolik:", err.message);
    });
  }

  const updateData = imagePath ? { ...data, image: imagePath } : data;

  const updated = await clothesRepository.updateClothes(id, updateData);
  return updated;
};

export const deleteClothes = async (id) => {
  const existing = await clothesRepository.findClothesById(id);

  if (!existing) {
    const error = new Error("Clothes not found");
    error.statusCode = 404;
    throw error;
  }

  // Rasmni ham o'chiramiz
  if (existing.image) {
    const imagePath = path.join(".", existing.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Rasmni o'chirishda xatolik:", err.message);
    });
  }

  return clothesRepository.deleteClothes(id);
};