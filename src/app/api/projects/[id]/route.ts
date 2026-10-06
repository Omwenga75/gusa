import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete project error:', err);
    return NextResponse.json({ error: 'Failed to delete initiative' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        status
      }
    });
    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    console.error('Update project error:', err);
    return NextResponse.json({ error: 'Failed to update initiative' }, { status: 500 });
  }
}
