// src/app/api/admin/admins/[id]/route.ts
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

// PATCH — update permissions, status, or password
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { permissions, status, password } = body;

  const data: any = {};
  if (permissions !== undefined) data.permissions = JSON.stringify(permissions);
  if (status !== undefined) data.status = status;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, permissions: true, status: true },
  });

  return NextResponse.json(updated);
}

// DELETE — remove an admin account
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;

  // Prevent deleting yourself
  const selfId = (session!.user as any).id;
  if (id === selfId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
