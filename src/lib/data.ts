/**
 * data.ts
 * تُستخدم من Server Components فقط — تقرأ مباشرة من SQLite
 */

import { getAllData, migrateFromJson } from './db-queries';
import fs from 'fs';
import path from 'path';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

let migrationDone = false;

export async function getData() {
  // Run one-time migration from data.json on first boot
  if (!migrationDone) {
    try {
      const jsonPath = path.join(process.cwd(), 'src', 'lib', 'data.json');
      if (fs.existsSync(jsonPath)) {
        const raw  = fs.readFileSync(jsonPath, 'utf8');
        const json = JSON.parse(raw);
        await migrateFromJson(json);
      }
    } catch {
      // Already migrated or no json file — fine
    }
    migrationDone = true;
  }

  return await getAllData();
}
