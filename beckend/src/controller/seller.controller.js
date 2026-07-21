import sellerService from "../services/seller.service.js";

async function register(req, res, next) {
  try {
    const { name, email, password, phone, age, brandname, shopname } = req.body;

    if (!name || !email || !password || !phone || !brandname || !shopname) {
      return res.status(400).json({
        success: false,
        message: "name, email, password, phone, brandname, shopname majburiy",
      });
    }

    const seller = await sellerService.register({ name, email, password, phone, age, brandname, shopname });
    return res.status(201).json({
      success: true,
      message: "Ro'yxatdan o'tdingiz, admin tasdig'ini kuting",
      data: seller,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email va password majburiy" });
    }

    const result = await sellerService.login({ email, password });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const seller = await sellerService.getProfile(req.seller.id);
    return res.status(200).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { name, phone, age, brandname, shopname } = req.body;
    const seller = await sellerService.updateProfile(req.seller.id, { name, phone, age, brandname, shopname });
    return res.status(200).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
}

async function deleteMe(req, res, next) {
  try {
    const result = await sellerService.deleteSeller(req.seller.id);
    return res.status(200).json({ success: true, message: "Seller o'chirildi", data: result });
  } catch (err) {
    next(err);
  }
}

// ---- ADMIN ENDPOINTLARI ----

async function getAll(req, res, next) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const result = await sellerService.getAllSellers({ page, limit, status });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const seller = await sellerService.getProfile(req.params.id);
    return res.status(200).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body; // "approved" | "rejected" | "pending"
    const seller = await sellerService.updateStatus(req.params.id, status);
    return res.status(200).json({ success: true, message: `Seller statusi: ${status}`, data: seller });
  } catch (err) {
    next(err);
  }
}

// ---- OBUNA ----

async function activateSubscription(req, res, next) {
  try {
    // Amalda bu yerga to'lov tizimi (Stripe/Payme/Click) tekshiruvi qo'shiladi.
    // Hozircha to'lov muvaffaqiyatli deb faraz qilib, obunani faollashtiramiz.
    const seller = await sellerService.activateSubscription(req.seller.id);
    return res.status(200).json({ success: true, message: "Obuna faollashtirildi (30 kun)", data: seller });
  } catch (err) {
    next(err);
  }
}

export default {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
  getAll,
  getOne,
  updateStatus,
  activateSubscription,
};