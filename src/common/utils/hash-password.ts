import * as bcryptjs from 'bcryptjs';

export const hashPassword = (password: string, salt = 10): string => bcryptjs.hashSync(password, salt);
export const verifyHashedPassword = async (requestedPassword: string, hashedPassword: string) => {
  return await bcryptjs.compare(requestedPassword, hashedPassword);
};
