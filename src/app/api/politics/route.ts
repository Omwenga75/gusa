import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminAuth';

// POST: Public submission for candidate nomination / expressing interest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      regNumber,
      yearOfStudy,
      county,
      subcounty,
      positionCategory,
      position,
      statement
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !regNumber || !yearOfStudy || !county) {
      return NextResponse.json(
        {
          error: 'Please provide all required fields: Full Name, Email, Phone, Registration Number, Year of Study, and County.'
        },
        { status: 400 }
      );
    }

    // Validate county value (Kisii or Nyamira)
    const normalizedCounty = county.trim();
    if (!['Kisii', 'Nyamira'].includes(normalizedCounty)) {
      return NextResponse.json(
        { error: 'County must be either Kisii or Nyamira.' },
        { status: 400 }
      );
    }

    const assignedPosition = position?.trim() || positionCategory?.trim() || 'General Aspirant';

    // Create nomination record in database
    const nomination = await prisma.nomination.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        regNumber: regNumber.trim().toUpperCase(),
        yearOfStudy: yearOfStudy.trim(),
        county: normalizedCounty,
        subcounty: subcounty ? subcounty.trim() : null,
        positionCategory: positionCategory ? positionCategory.trim() : null,
        position: assignedPosition,
        statement: statement ? statement.trim() : null,
        status: 'PENDING'
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Nomination submitted successfully.',
        nomination
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Politics nomination POST error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit nomination application.' },
      { status: 500 }
    );
  }
}

// GET: Admin-only fetch for politics nominations
export async function GET(request: NextRequest) {
  const { error } = await verifyAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('countOnly');
    const status = searchParams.get('status');
    const county = searchParams.get('county');
    const search = searchParams.get('search');

    if (countOnly === 'true') {
      const [total, pending, approved, rejected, kisii, nyamira] = await Promise.all([
        prisma.nomination.count(),
        prisma.nomination.count({ where: { status: 'PENDING' } }),
        prisma.nomination.count({ where: { status: 'APPROVED' } }),
        prisma.nomination.count({ where: { status: 'REJECTED' } }),
        prisma.nomination.count({ where: { county: 'Kisii' } }),
        prisma.nomination.count({ where: { county: 'Nyamira' } })
      ]);

      return NextResponse.json({
        counts: {
          total,
          pending,
          approved,
          rejected,
          kisii,
          nyamira
        }
      });
    }

    // Build filter where clause
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    if (county && county !== 'all') {
      where.county = county;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { regNumber: { contains: q, mode: 'insensitive' } },
        { position: { contains: q, mode: 'insensitive' } },
        { positionCategory: { contains: q, mode: 'insensitive' } },
        { statement: { contains: q, mode: 'insensitive' } }
      ];
    }

    const [nominations, totalCount, pendingCount, approvedCount, rejectedCount, kisiiCount, nyamiraCount] =
      await Promise.all([
        prisma.nomination.findMany({
          where,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.nomination.count(),
        prisma.nomination.count({ where: { status: 'PENDING' } }),
        prisma.nomination.count({ where: { status: 'APPROVED' } }),
        prisma.nomination.count({ where: { status: 'REJECTED' } }),
        prisma.nomination.count({ where: { county: 'Kisii' } }),
        prisma.nomination.count({ where: { county: 'Nyamira' } })
      ]);

    return NextResponse.json({
      nominations,
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        kisii: kisiiCount,
        nyamira: nyamiraCount
      }
    });
  } catch (error: any) {
    console.error('Politics nomination GET error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch nominations.' },
      { status: 500 }
    );
  }
}

// PATCH: Admin-only update for nomination status / details
export async function PATCH(request: NextRequest) {
  const { error } = await verifyAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, status, position, statement } = body;

    if (!id) {
      return NextResponse.json({ error: 'Nomination ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (position !== undefined) updateData.position = position;
    if (statement !== undefined) updateData.statement = statement;

    const updated = await prisma.nomination.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, nomination: updated });
  } catch (error: any) {
    console.error('Politics nomination PATCH error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update nomination.' },
      { status: 500 }
    );
  }
}

// DELETE: Admin-only delete nomination record
export async function DELETE(request: NextRequest) {
  const { error } = await verifyAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Nomination ID is required.' }, { status: 400 });
    }

    await prisma.nomination.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Nomination deleted successfully.' });
  } catch (error: any) {
    console.error('Politics nomination DELETE error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete nomination.' },
      { status: 500 }
    );
  }
}
