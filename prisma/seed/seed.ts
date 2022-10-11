import countries from './countries.json';
import { PrismaClient } from '@prisma/client';

type JSONCountry = {
  iso: string;
  iso3: string | null;
  name: string;
  nicename: string;
};

const prisma = new PrismaClient();

const main = async () => {
  const mCountry = await prisma.country.findFirst();
  if (mCountry) return;

  const promises: Promise<any>[] = [];
  const ctr = countries as JSONCountry[];
  ctr.forEach(({ iso, iso3, name, nicename: niceName }: JSONCountry) => {
    promises.push(
      prisma.country.create({ data: { iso, iso3, name, niceName } })
    );
  });

  await Promise.all(promises);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
