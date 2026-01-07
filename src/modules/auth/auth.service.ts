import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { SignupInput, LoginInput } from './auth.schema';
import { ValidationError, UnauthorizedError } from '../../shared/errors';

/**
 * Hashes a password using bcrypt.
 * 
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Verifies a password against a hash.
 * 
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Creates a new user account.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param data - Signup input data
 * @returns Created user (without password hash)
 * @throws ValidationError if email already exists
 */
export const signup = async (app: FastifyInstance, data: SignupInput) => {
  const existingUser = await app.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ValidationError('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await app.prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      timezone: data.timezone ?? 'Asia/Kolkata',
    },
    select: {
      id: true,
      email: true,
      timezone: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Authenticates a user and returns a JWT token.
 * 
 * @param app - Fastify instance with prisma and jwt decorators
 * @param data - Login input data
 * @returns JWT token and user info
 * @throws UnauthorizedError if credentials are invalid
 */
export const login = async (app: FastifyInstance, data: LoginInput) => {
  const user = await app.prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      timezone: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValidPassword = await verifyPassword(data.password, user.passwordHash);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = app.jwt.sign({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      timezone: user.timezone,
    },
  };
};

