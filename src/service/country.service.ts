import prisma from '../util/client';

export const getAllCountries = async () => {
  const countries = await prisma.country.findMany({
    select: { id: true, iso: true, niceName: true },
  });
  return countries;
};

export const getCountryById = async (countryId: number) => {
  const country = await prisma.country.findFirst({ where: { id: countryId } });
  return country;
};

export const getCountryByISO = async (isoCode: string) => {
  const country = await prisma.country.findFirst({ where: { iso: isoCode } });
  return country;
};

export const defaultCountry = async () => {
  return await prisma.country.findFirst();
};
