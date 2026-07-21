const jwt = require('jsonwebtoken');

exports.protectSeller = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token topilmadi yoki formati noto'g'ri" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("Xavfli xato: .env faylida JWT_SECRET aniqlanmagan!");
    return res.status(500).json({ message: "Server ichki sozlash xatosi" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Muvaffaqiyatli decoded bo'ldi:", decoded);

    if (decoded.role !== "seller" && decoded.role !== undefined) {
      return res.status(403).json({ message: "Ruxsat yo'q, siz seller emassiz" });
    }

    req.sellerId = decoded.id;
    next();
  } catch (err) {
    // 2. Xatolik aynan nimaligini terminalda (backend konsolida) ko'rish uchun:
    console.error("JWT Verification Error:", err.message);
    
    return res.status(401).json({ message: "Token noto'g'ri yoki muddati o'tgan" });
  }
};