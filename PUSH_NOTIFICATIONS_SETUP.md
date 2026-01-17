# Push Notifications Setup Guide

Denne guide forklarer hvordan du opsætter push notifications i Arzonic webappen.

## 1. Opret VAPID Keys

Push notifications kræver VAPID (Voluntary Application Server Identification) keys. Du kan generere disse ved hjælp af web-push biblioteket:

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Dette vil give dig:
- **Public Key**: Tilføj denne som `NEXT_PUBLIC_VAPID_PUBLIC_KEY` i din `.env` fil
- **Private Key**: Brug denne på serveren når du sender push notifications (gem den sikkert!)

## 2. Opret Supabase Tabel

Opret følgende tabel i Supabase for at gemme push subscriptions:

```sql
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for hurtigere opslag
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
```

## 3. Environment Variabler

Tilføj følgende til din `.env` fil:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=din_public_key_her
```

## 4. Sådan fungerer det

1. **Service Worker Registration**: Når appen loader, registreres service worker'en automatisk i `ClientLayout`
2. **Push Subscription**: Hvis VAPID key er sat, spørger appen om tilladelse til notifications
3. **Gem i Supabase**: Subscription gemmes automatisk i `push_subscriptions` tabellen
4. **Push Events**: Når en push notification modtages, vises den via service worker'en

## 5. Sende Push Notifications

For at sende push notifications fra serveren, skal du bruge `web-push` biblioteket:

```typescript
import webpush from 'web-push';
import { createAdminClient } from '@/utils/supabase/server';

// Sæt VAPID detaljer
webpush.setVapidDetails(
  'mailto:din@email.com', // Kontakt email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY! // Gem denne sikkert!
);

// Hent alle subscriptions fra Supabase
const supabase = await createAdminClient();
const { data: subscriptions } = await supabase
  .from('push_subscriptions')
  .select('*');

// Send til alle
for (const sub of subscriptions || []) {
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      },
      JSON.stringify({
        title: 'Ny besked',
        body: 'Dette er en test besked',
        tag: 'notification-tag',
      })
    );
  } catch (error) {
    console.error('Fejl ved sending af push:', error);
    // Hvis subscription er ugyldig, slet den
    if (error.statusCode === 410 || error.statusCode === 404) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint);
    }
  }
}
```

## 6. Test

1. Start appen og åbn i browseren
2. Tjek browser console for "Service Worker registreret" og "Push subscription gemt i Supabase"
3. Tjek Supabase dashboard for at se om subscription er gemt
4. Send en test notification fra serveren

## Noter

- Push notifications virker kun over HTTPS (eller localhost til udvikling)
- Brugere skal give tilladelse til notifications
- Service worker'en skal være registreret før subscription kan oprettes
- Hvis subscription bliver ugyldig (f.eks. brugeren unsubscribe), skal den slettes fra databasen
