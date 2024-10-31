import { LoginType, PrismaClient, Role } from '@prisma/client';
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
