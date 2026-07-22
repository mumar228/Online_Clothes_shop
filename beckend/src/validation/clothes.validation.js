import Joi from "joi";

export const validateClothes = (req, res, next) => {
  const schema = Joi.object({
    brand: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Brend nomi bo'sh bo'lishi mumkin emas!",
      "string.min": "Brend nomi kamida 2 ta harfdan iborat bo'lishi kerak!",
      "string.max": "Brend nomi 100 ta belgidan oshmasligi kerak!"
    }),

    size: Joi.string().max(150).required().messages({
      "string.empty": "Kiyim o'lchami (size) kiritilishi shart!",
      "string.max": "O'lcham matni juda uzun (maksimal 150 belgi)!"
    }),

    color: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Kiyim rangi (color) kiritilishi shart!",
      "string.min": "Rang nomi kamida 2 ta harfdan iborat bo'lishi kerak!",
      "string.max": "Rang nomi 50 ta belgidan oshmasligi kerak!"
    }),

    about: Joi.string().max(150).required().messages({
      "string.empty": "Kiyim haqida ma'lumot kiritilishi shart!",
      "string.max": "Haqida ma'lumot matni juda uzun (maksimal 150 belgi)!"
    }),

    brandcountry: Joi.number().integer().positive().required().messages({
      "number.base": "Brend davlat kodi raqam bo'lishi kerak!",
      "number.positive": "Davlat kodi noto'g'ri kiritildi!",
      "any.required": "Brend davlati majburiy maydon!"
    }),

    price: Joi.number().integer().min(0).required().messages({
      "number.base": "Narxi faqat raqamlardan iborat bo'lishi kerak!",
      "number.min": "Kiyim narxi 0 dan kichik bo'lishi mumkin emas!",
      "any.required": "Kiyim narxini kiritish shart!"
    }),

    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Ombor qoldig'i (stock) raqam bo'lishi kerak!",
      "number.min": "Ombordagi mahsulot soni 0 dan kam bo'lishi mumkin emas!",
      "any.required": "Ombor qoldig'ini kiritish shart!"
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  if (req.method === "POST" && !req.file) {
    return res.status(400).json({
      success: false,
      message: "Kiyim rasmi (image) yuklanishi shart!",
    });
  }

  next();
};