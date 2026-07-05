import { NextResponse } from 'next/server';
import {
  getAllData,
  saveSira,
  saveKafaat,
  saveMakhtutat,
  saveKitabat,
  saveImtihanat,
  migrateFromJson,
} from '@/lib/db-queries';
import fs from 'fs';
import path from 'path';

// Run one-time migration from data.json on first boot
async function runMigrationIfNeeded() {
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'lib', 'data.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const jsonData = JSON.parse(raw);
      await migrateFromJson(jsonData);
    }
  } catch (e) {
    // No data.json or already migrated — that's fine
  }
}

export async function GET() {
  try {
    const data = await getAllData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data from DB:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Save each section to its own table
    if (body.siteOwner)         await saveSira(body.siteOwner);
    if (body.skills)            await saveKafaat(body.skills);
    if (body.proofreadingWorks) await saveMakhtutat(body.proofreadingWorks);
    if (body.articles)          await saveKitabat(body.articles);
    if (body.tests)             await saveImtihanat(body.tests);

    return NextResponse.json({ success: true, message: 'Data saved to database' });
  } catch (error) {
    console.error('Error saving data to DB:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
