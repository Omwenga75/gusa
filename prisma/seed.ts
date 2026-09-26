// prisma/seed.ts — CLEAN SLATE SEED
// Wipes ALL data and creates only the super-admin account
// + empty site-setting keys so the admin panel can populate them.

import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹  Clearing all tables...');

  // Delete in dependency order (children before parents)
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.galleryImage.deleteMany({});
  await prisma.album.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.leader.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅  All tables cleared.');

  // ── Super-Admin account ───────────────────────────────────────────────────
  const adminPassword = await bcryptjs.hash('Admin@2026', 10);

  await prisma.user.create({
    data: {
      name: 'GUSA Super Admin',
      email: 'admin@gusa.org',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅  Super-admin created: admin@gusa.org  /  Admin@2026');

  // ── Empty site-setting keys (values are blank strings) ───────────────────
  // These keys are expected by the admin settings panel; values will be filled
  // in by the admin through the UI.
  const settingKeys = [
    // Landing / Hero
    { key: 'heroTitle',    category: 'landing' },
    { key: 'heroSubtitle', category: 'landing' },
    { key: 'heroImage',    category: 'landing' },
    // About
    { key: 'aboutText',   category: 'about' },
    { key: 'missionText', category: 'about' },
    { key: 'visionText',  category: 'about' },
    // Contact
    { key: 'contactEmail',    category: 'contact' },
    { key: 'contactPhone',    category: 'contact' },
    { key: 'contactLocation', category: 'contact' },
    { key: 'officeHours',     category: 'contact' },
    // Social media
    { key: 'facebook',  category: 'social' },
    { key: 'instagram', category: 'social' },
    { key: 'tiktok',    category: 'social' },
    { key: 'twitter',   category: 'social' },
    { key: 'whatsapp',  category: 'social' },
    { key: 'youtube',   category: 'social' },
  ];

  for (const s of settingKeys) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},                    // keep any value the admin already set
      create: { key: s.key, value: '', category: s.category },
    });
  }

  console.log('✅  Site-setting keys initialised (all values empty).');
  console.log('\n🎉  Clean slate ready. Log in as admin@gusa.org to add real data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
