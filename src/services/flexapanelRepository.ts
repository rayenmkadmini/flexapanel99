import { readRecords, upsertRecord } from '../lib/supabaseCrud';

export type FlexapanelSnapshot = Record<string, unknown>;

const TABLE_NAME = 'flexapanel_records';

export async function fetchSnapshot() {
  const rows = await readRecords<{ key: string; value: unknown }>(TABLE_NAME, {}, 'key,value');
  return rows.reduce<FlexapanelSnapshot>((snapshot, row) => {
    snapshot[row.key] = row.value;
    return snapshot;
  }, {});
}

export async function saveSnapshot(snapshot: FlexapanelSnapshot) {
  const rows = Object.entries(snapshot).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  return upsertRecord(TABLE_NAME, rows, 'key');
}

export async function saveSnapshotKey(key: string, value: unknown) {
  return upsertRecord(TABLE_NAME, [{ key, value, updated_at: new Date().toISOString() }], 'key');
}