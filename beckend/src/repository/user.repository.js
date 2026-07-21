import { AppDataSource } from "../config/data-sorce.js";
import { UserEntity } from "../models/user.entity.js";

const userRepo = AppDataSource.getRepository(UserEntity);

export const findAllUsers = async () => {
  return userRepo.find({ order: { id: "DESC" } });
};

export const findUserById = async (id) => {
  return userRepo.findOneBy({ id });
};


export const findUserByEmail = async (email) => {
  return userRepo.findOneBy({ email });
};

export const createUser = async ({ name, email, age, password, role }) => {
  const user = userRepo.create({ name, email, age, password, role });
  return userRepo.save(user); // INSERT ... RETURNING *
};

export const register = async (data) => {
  const { name, email, password, age, role } = data;

  if (!name || !email || !password) {
    const error = new Error("Name, email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existing = await userRepository.findUserByEmail(email);
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    age,
    role: role || "user",
  });

  const token = jwt.sign(
    { id: user.id, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
    refreshToken,
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
    refreshToken,
  };
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token talab qilinadi");
    error.statusCode = 400;
    throw error;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await userRepository.findUserById(decoded.id);
    if (!user) {
      const error = new Error("User topilmadi");
      error.statusCode = 404;
      throw error;
    }

    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { token: newToken };
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.message = error.message || "Refresh token noto'g'ri yoki muddati o'tgan";
    throw error;
  }
};

