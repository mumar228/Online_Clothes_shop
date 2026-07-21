import * as userRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const getUsers = async () => {
	return userRepository.findAllUsers();
};

export const getUser = async (id) => {
	const user = await userRepository.findUserById(id);

	if (!user) {
		const error = new Error("User not found");
		error.statusCode = 404;
		throw error;
	}

	return user;
};

export const createUser = async (data) => {
	const { name, email, age } = data;

	if (!name || !email) {
		const error = new Error("Name and email are required");
		error.statusCode = 400;
		throw error;
	}

	return userRepository.createUser({ name, email, age });
};

export const register = async (data) => {
  const { name, email, password, age,role} = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    age,
    role: "user",
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
  // await userRepository.updateUser(user.id, { refreshToken });

  return { user, token, refreshToken };
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials"); 
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
  // await userRepository.updateUser(user.id, { refreshToken });

  return { 
    user: { id: user.id, name: user.name, email: user.email }, 
    token,
    refreshToken 
  };
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token talab qilinadi");
  }
  const user = await userRepository.findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new Error("Token noto'g'ri yoki yaroqsiz");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { token: newToken };
  } catch (error) {
    throw new Error("Refresh token muddati o'tgan");
  }
};