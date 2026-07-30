import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, modules, progressRecords, assessmentResults, caseAttempts, lessons } from '@/lib/db/schema';

export async function GET(_request: Request) {
  try {
    const database = await getDb();
    if (!database) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const allUsers = await database.select().from(users);
    const students = allUsers.filter(u => u.role === 'student');
    const instructors = allUsers.filter(u => u.role === 'instructor');

    const allModules = await database.select().from(modules);
    const allLessons = await database.select().from(lessons);
    const allProgress = await database.select().from(progressRecords);
    const allAssessments = await database.select().from(assessmentResults);
    const allCaseAttempts = await database.select().from(caseAttempts);

    const totalSessions = allProgress.length + allCaseAttempts.length;
    const totalAssignments = allAssessments.length;
    const avgCompletionRate = allModules.length > 0
      ? Math.round((allProgress.filter(p => p.completedAt).length / allModules.length) * 100)
      : 0;

    return NextResponse.json({
      totalStudents: students.length,
      totalInstructors: instructors.length,
      totalModules: allModules.length,
      totalSessions,
      totalAssignments,
      avgCompletionRate,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}