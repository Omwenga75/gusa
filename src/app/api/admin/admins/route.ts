// src/app/api/admin/admins/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function requireSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== 'SUPER_ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

// GET — list all admins
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    select: { id: true, name: true, email: true, role: true, permissions: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(admins);
}

// POST — create a new scoped admin
export async function POST(req: NextRequest) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, email, password, permissions } = body;

  if (!name || !email || !password || !Array.isArray(permissions)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'ADMIN',
      permissions: JSON.stringify(permissions),
      status: 'ACTIVE',
    },
    select: { id: true, name: true, email: true, role: true, permissions: true, status: true, createdAt: true },
  });

  return NextResponse.json(admin, { status: 201 });
}
