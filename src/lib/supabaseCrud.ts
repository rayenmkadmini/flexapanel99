import { PostgrestError } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabaseClient';

export type CrudFilter = Record<string, string | number | boolean>;

const allowedTables = new Set([
  'flexapanel_records',
  'users',
  'services',
  'orders',
  'deposits',
  'tickets',
  'providers',
  'payment_gateways',
  'announcements',
  'logs',
]);

function assertAllowedTable(table: string) {
  if (!allowedTables.has(table)) {
    throw new Error(`Table "${table}" is not allowed for CRUD operations.`);
  }
}

function assertPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Payload must be a non-empty object.');
  }
}

function formatError(error: PostgrestError | null) {
  if (!error) return null;
  return new Error(`${error.message}${error.details ? `: ${error.details}` : ''}`);
}

export async function createRecord<T>(table: string, payload: Record<string, unknown>) {
  assertAllowedTable(table);
  assertPayload(payload);

  const { data, error } = await getSupabaseClient()
    .from(table)
    .insert(payload)
    .select()
    .single();

  const formatted = formatError(error);
  if (formatted) throw formatted;
  return data as T;
}

export async function readRecords<T>(table: string, filters: CrudFilter = {}, select = '*') {
  assertAllowedTable(table);

  let query = getSupabaseClient().from(table).select(select);
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;
  const formatted = formatError(error);
  if (formatted) throw formatted;
  return (data || []) as T[];
}

export async function readRecordById<T>(table: string, id: string | number, idColumn = 'id', select = '*') {
  assertAllowedTable(table);

  const { data, error } = await getSupabaseClient()
    .from(table)
    .select(select)
    .eq(idColumn, id)
    .single();

  const formatted = formatError(error);
  if (formatted) throw formatted;
  return data as T;
}

export async function updateRecord<T>(table: string, id: string | number, updates: Record<string, unknown>, idColumn = 'id') {
  assertAllowedTable(table);
  assertPayload(updates);

  const { data, error } = await getSupabaseClient()
    .from(table)
    .update(updates)
    .eq(idColumn, id)
    .select()
    .single();

  const formatted = formatError(error);
  if (formatted) throw formatted;
  return data as T;
}

export async function deleteRecord<T>(table: string, id: string | number, idColumn = 'id') {
  assertAllowedTable(table);

  const { data, error } = await getSupabaseClient()
    .from(table)
    .delete()
    .eq(idColumn, id)
    .select()
    .single();

  const formatted = formatError(error);
  if (formatted) throw formatted;
  return data as T;
}

export async function upsertRecord<T>(table: string, payload: Record<string, unknown> | Record<string, unknown>[], onConflict = 'id') {
  assertAllowedTable(table);

  const { data, error } = await getSupabaseClient()
    .from(table)
    .upsert(payload, { onConflict })
    .select();

  const formatted = formatError(error);
  if (formatted) throw formatted;
  return (data || []) as T[];
}