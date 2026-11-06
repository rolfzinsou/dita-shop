# Dita-shop
1. `npm install`
2. Supabase : crée un projet, exécute `supabase.sql`, copie URL + clés dans `.env.local` (voir `.env.example`)
3. Mot de passe admin : `npm run hash -- "monmotdepasse"` → colle le résultat dans ADMIN_PASSWORD_HASH
4. Notifs : `npx web-push generate-vapid-keys` → clés publique/privée dans `.env.local`
5. `npm run dev` → http://localhost:3000 et /admin
6. Déploiement Vercel : mêmes variables d'environnement + CRON_SECRET (le cron quotidien de vercel.json envoie les rappels)
## Disponibilité
Jours 0=dimanche … 6=samedi. Liste vide = tous les jours. Un produit sans jours hérite de sa catégorie ; s'il a ses propres jours, ils priment.
