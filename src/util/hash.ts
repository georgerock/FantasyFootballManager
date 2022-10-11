import bcrypt from 'bcrypt';

const saltWorkFactor = process.env.SALT_WORK_FACTOR
  ? parseInt(process.env.SALT_WORK_FACTOR, 10)
  : 10;

export const hash = async (text: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hashedString = await bcrypt.hash(text, salt);
  return hashedString;
};

export const hashSync = (text: string): string => {
  const salt = bcrypt.genSaltSync(saltWorkFactor);
  const hashedString = bcrypt.hashSync(text, salt);
  return hashedString;
};

export const compare = async (
  candidate: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(candidate, hash).catch((_e) => false);
};

export default hash;
