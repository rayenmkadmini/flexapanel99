# Supabase CRUD Examples for FlexaPanel

## Environment variables

```bash
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

## Create or update one snapshot key

```ts
import { saveSnapshotKey } from '../src/services/flexapanelRepository';

await saveSnapshotKey('settings', settingsObject);
```

## Read the full snapshot

```ts
import { fetchSnapshot } from '../src/services/flexapanelRepository';

const snapshot = await fetchSnapshot();
console.log(snapshot.users, snapshot.services);
```

## Generic CRUD

```ts
import { createRecord, readRecords, updateRecord, deleteRecord } from '../src/lib/supabaseCrud';

const row = await createRecord('flexapanel_records', {
  key: 'example',
  value: { hello: 'world' },
});

const rows = await readRecords('flexapanel_records');

await updateRecord('flexapanel_records', 'example', {
  value: { hello: 'updated' },
}, 'key');

await deleteRecord('flexapanel_records', 'example', 'key');
```

## SMM proxy endpoint

Deploy the Supabase Edge Function:

```bash
npx supabase functions deploy smm-proxy --no-verify-jwt
```

Then call:

```ts
await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/smm-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiUrl: 'https://smmparty.com/api/v2',
    apiKey: 'YOUR_SMM_API_KEY',
    action: 'balance',
  }),
});
```