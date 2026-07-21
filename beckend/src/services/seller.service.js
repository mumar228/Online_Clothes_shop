import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sellerRepository from "../repository/seller.repository.js";

const SUBSCRIPTION_DAYS = 30;

function toPublic(seller) {
  if (!seller) return null;
  const { password, ...publicData } = seller;
  return publicData;
}

async function register({ name, email, password, phone, age, brandname, shopname }) {
  const existingEmail = await sellerRepository.findByEmail(email);
  if (existingEmail) {
    const err = new Error("Bu email bilan seller allaqachon ro'yxatdan o'tgan");
    err.statusCode = 409;
    throw err;
  }

  const existingShop = await sellerRepository.findByShopname(shopname);
  if (existingShop) {
    const err = new Error("Bu do'kon nomi band, boshqasini tanlang");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Bu yerda status srazu "active" bo'ladi va hech qanday cheklov yaratmaydi
  const seller = await sellerRepository.create({
    name,
    email,
    password: hashedPassword,
    phone,
    age,
    brandname,
    shopname,
    role: "seller",
    status: "active", 
    subscriptionStatus: "active", // Obunani ham srazu faol qilamiz
  });

  const token = jwt.sign(
    { id: seller.id, email: seller.email, role: seller.role || "seller" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Muddati ham 7 kunga uzaytirildi, tezda tugab qolmasligi uchun
  );

  return {
    seller: toPublic(seller),
    token
  };
}

async function login({ email, password }) {
  const seller = await sellerRepository.findByEmail(email);
  if (!seller) {
    const err = new Error("Email yoki parol noto'g'ri");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) {
    const err = new Error("Email yoki parol noto'g'ri");
    err.statusCode = 401;
    throw err;    
  }

  // 🔴 Barcha "pending" va "rejected" tekshiruvlari bu yerdan olib tashlandi!
  // Seller paroli to'g'ri bo'lsa, srazu tizimga kiradi.

  const token = jwt.sign(
    { id: seller.id, email: seller.email, role: seller.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, seller: toPublic(seller) };
}

async function getProfile(id) {
  const seller = await sellerRepository.findById(id);
  if (!seller) {
    const err = new Error("Seller topilmadi");
    err.statusCode = 404;
    throw err;
  }
  return toPublic(seller);
}

async function getAllSellers({ page, limit, status }) {
  const { rows, total } = await sellerRepository.findAll({ page, limit, status });
  return {
    items: rows.map(toPublic),
    pagination: {
      total,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      totalPages: Math.ceil(total / (Number(limit) || 10)),
    },
  };
}

async function updateProfile(id, data) {
  const existing = await sellerRepository.findById(id);
  if (!existing) {
    const err = new Error("Seller topilmadi");
    err.statusCode = 404;
    throw err;
  }

  // Sezilarli maydonlarni to'g'ridan-to'g'ri o'zgartirishga yo'l qo'ymaymiz
  const { password, role, status, subscriptionStatus, subscriptionExpiresAt, ...safeData } = data;

  const updated = await sellerRepository.update(id, safeData);
  return toPublic(updated);
}

async function deleteSeller(id) {
  const existing = await sellerRepository.findById(id);
  if (!existing) {
    const err = new Error("Seller topilmadi");
    err.statusCode = 404;
    throw err;
  }
  await sellerRepository.remove(id);
  return { id };
}

/**
 * ADMIN: sellerni tasdiqlash yoki rad etish
 */
async function updateStatus(id, status) {
  if (!["pending", "approved", "rejected"].includes(status)) {
    const err = new Error("status faqat pending, approved yoki rejected bo'lishi mumkin");
    err.statusCode = 400;
    throw err;
  }

  const existing = await sellerRepository.findById(id);
  if (!existing) {
    const err = new Error("Seller topilmadi");
    err.statusCode = 404;
    throw err;
  }

  const updated = await sellerRepository.update(id, { status });
  return toPublic(updated);
}

/**
 * $15/oy obunani faollashtirish (to'lov tasdiqlangandan keyin chaqiriladi)
 */
async function activateSubscription(id) {
  const existing = await sellerRepository.findById(id);
  if (!existing) {
    const err = new Error("Seller topilmadi");
    err.statusCode = 404;
    throw err;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_DAYS);

  const updated = await sellerRepository.update(id, {
    subscriptionStatus: "active",
    subscriptionExpiresAt: expiresAt,
  });

  return toPublic(updated);
}

/**
 * Obuna muddati o'tganligini tekshirish (middleware yoki cron uchun ishlatiladi)
 */
function isSubscriptionActive(seller) {
  if (seller.subscriptionStatus !== "pending") return false;
  if (!seller.subscriptionExpiresAt) return false;
  return new Date(seller.subscriptionExpiresAt) > new Date();
}

export default {
  register,
  login,
  getProfile,
  getAllSellers,
  updateProfile,
  deleteSeller,
  updateStatus,
  activateSubscription,
  isSubscriptionActive,
};