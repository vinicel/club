# 🚀 Commandes curl pour tester l'API Club Fans

## Configuration
BASE_URL=http://localhost:3000
EMAIL=test@club.fans
PASSWORD=123456

## 1. 🔐 Login (créer/connecter un utilisateur)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@club.fans", "password": "123456"}'

## 2. 👤 Récupérer le profil utilisateur (remplacer YOUR_TOKEN)
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

## 3. ✨ Créer un créateur (remplacer YOUR_TOKEN)
curl -X POST http://localhost:3000/creators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"username": "creatorX", "monthlyPrice": 499}'

## 4. 🔍 Récupérer un créateur par username (remplacer YOUR_TOKEN)
curl -X GET http://localhost:3000/creators/creatorX \
  -H "Authorization: Bearer YOUR_TOKEN"

## 5. 🧪 Exemple avec un autre créateur
curl -X POST http://localhost:3000/creators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"username": "johndoe", "monthlyPrice": 999}'

curl -X GET http://localhost:3000/creators/johndoe \
  -H "Authorization: Bearer YOUR_TOKEN"

## Notes importantes :
# - Remplacez YOUR_TOKEN par le token obtenu lors du login
# - Le monthlyPrice est en centimes (499 = 4,99€)
# - L'utilisateur test@club.fans est créé automatiquement s'il n'existe pas
# - Tous les endpoints sauf /auth/login nécessitent l'authentification
