import { LoginType, PrismaClient, Role } from '@prisma/client';

import { mergedCountries } from './data/mergedCountries';

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = 'super_admin@amygdal.com';
const ADMIN_EMAIL = 'admin@amygdal.com';
const USER_EMAIL = 'user@amygdal.com';

const DEV_PASSWORD =
  'ba7b868538a581f70906797bc1f213b1:0cb38a4e7a850f842ee959452dc5200e5b1b0e3ae82dd380d0f5ee47b70dc67a039282662875196c2ea822647220ccfb3185bb0dbae46f58137376708cc46633';
async function main() {
  const SUPER_ADMIN = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {},
    create: {
      email: SUPER_ADMIN_EMAIL,
      username: 'super_admin',
      firstName: 'James',
      lastName: 'esim',
      role: Role.SUPER_ADMIN,
      password: DEV_PASSWORD,
      loginType: LoginType.CREDENTIALS,
    },
  });
  console.log('User created with id: ', SUPER_ADMIN.id);

  const ADMIN = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      username: 'admin',
      firstName: 'adam',
      lastName: 'esim',
      role: Role.ADMIN,
      password:
        'ba7b868538a581f70906797bc1f213b1:0cb38a4e7a850f842ee959452dc5200e5b1b0e3ae82dd380d0f5ee47b70dc67a039282662875196c2ea822647220ccfb3185bb0dbae46f58137376708cc46633',
      loginType: LoginType.CREDENTIALS,
    },
  });

  console.log('User created with id: ', ADMIN.id);

  const SUPER_ADMIN_2 = await prisma.user.upsert({
    where: { email: 'bektasaisa+10@gmail.com' },
    update: {},
    create: {
      email: 'bektasaisa+10@gmail.com',
      username: 'bektasaisa',
      firstName: 'Aisa',
      lastName: 'Bektas',
      role: Role.SUPER_ADMIN,
      password: DEV_PASSWORD,
      loginType: LoginType.CREDENTIALS,
    },
  });

  console.log('User created with id: ', SUPER_ADMIN_2.id);
  const USER = await prisma.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: {
      email: USER_EMAIL,
      username: 'user_1',
      firstName: 'felix',
      lastName: 'esim',
      role: Role.USER,
      password: DEV_PASSWORD,
      loginType: LoginType.CREDENTIALS,
    },
  });

  console.log('User created with id: ', USER.id);

  const data = mergedCountries;
  const countries = data;

  for (const country of countries) {
    // Create image entry if available
    const image = country.image
      ? await prisma.image.create({
          data: {
            src: country.image.url,
            width: country.image.width,
            height: country.image.height,
          },
        })
      : null;

    // Create or update currency
    const currency = country.currency
      ? await prisma.currency.upsert({
          where: { code: country.currency.code },
          update: {},
          create: {
            code: country.currency.code,
            name: country.currency.name,
            symbol: country.currency.symbol,
          },
        })
      : null;

    // Create or update language
    const language = country.language
      ? await prisma.language.upsert({
          where: { code: country.language.code },
          update: {},
          create: {
            code: country.language.code,
            name: country.language.name,
          },
        })
      : null;

    // Create country entry
    await prisma.country.create({
      data: {
        slug: country.slug,
        title: country.title,
        code: country.code ? country.code : undefined,
        region: country.region ? country.region : null,
        diallingCode: country.diallingCode ? country.diallingCode : null,
        image: image
          ? {
              connect: { id: image.id }, // Reference to the image by its id
            }
          : undefined,
        currency: currency ? { connect: { code: currency.code } } : undefined,
        language: language ? { connect: { code: language.code } } : undefined,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
