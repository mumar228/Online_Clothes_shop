import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(
      "❌ Middleware xatosi: Authorization Header topilmadi yoki noto'g'ri formatda",
    );
    return res
      .status(401)
      .json({
        success: false,
        message: "Token topilmadi, iltimos tizimga kiring",
      });
  }

  const token = authHeader.split(" ")[1];

  // .env tekshiruvi
  if (!process.env.JWT_SECRET) {
    console.error(
      "❌ XAVFLI XATO: process.env.JWT_SECRET topilmadi! .env yuklanganini tekshiring.",
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Konsolda tokendan nimalar ochilganini ko'ramiz
    console.log(
      "✅ Token muvaffaqiyatli dekodlandi. Seller ma'lumotlari:",
      decoded,
    );

    req.seller = decoded;
    next();
  } catch (err) {
    // Xatolik sababini terminalda chiqarish:
    console.error("❌ JWT VERIFY XATOSI:", err.message);

    return res
      .status(401)
      .json({ success: false, message: "Token yaroqsiz yoki muddati o'tgan" });
  }
}

export function adminOnly(req, res, next) {
  if (req.seller?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Bu amal faqat admin uchun" });
  }
  next();
}

export async function getMe(req, res) {
  try {
    const seller = await Seller.findById(req.seller.id).select("-password");

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).json({ success: true, seller });
  } catch (err) {
    console.error("❌ getMe xatosi:", err.message);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
}