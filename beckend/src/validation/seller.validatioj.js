import Joi from "joi";

export const validateSellerRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Ism maydoni bo'sh bo'lishi mumkin emas!",
      "string.min": "Ism kamida 3 ta harfdan iborat bo'lishi kerak!",
    }),
    
    email: Joi.string().email().max(150).required().messages({
      "string.email": "Yaroqli email manzilini kiriting (masalan: info@lume.uz)!",
      "string.empty": "Email maydoni bo'sh bo'lishi shart!",
    }),

    // Telefon raqami: faqat raqamlar, + belgisi va uzunligi 9 tadan 20 tagacha bo'lishi mumkin
    phone: Joi.string().pattern(/^\+?[0-9]{9,20}$/).required().messages({
      "string.pattern.base": "Telefon raqami noto'g'ri formatda! (Masalan: +998901234567)",
      "string.empty": "Telefon raqami bo'sh bo'lishi mumkin emas!",
    }),

    age: Joi.number().integer().min(16).max(100).optional().messages({
      "number.min": "Sotuvchi kamida 16 yosh bo'lishi kerak!",
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Parol juda oddiy! Kamida 6 ta belgi bo'lishi kerak.",
      "string.empty": "Parol kiritish majburiy!",
    }),

    brandname: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Brend nomi kiritilishi shart!",
    }),

    shopname: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Do'kon nomi kiritilishi shart!",
    }),

    role: Joi.string().valid("seller", "admin").optional(),
    subscriptionStatus: Joi.string().valid("active", "inactive").optional(),
    status: Joi.string().valid("pending", "approved", "rejected", "active").optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: true }); 
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};