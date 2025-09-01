import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';

async function createTestUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Créer un utilisateur de test
    const testEmail = 'test@club.fans';
    const testPassword = 'testclub';

    console.log('🔄 Suppression de l\'ancien utilisateur et création d\'un nouveau...');

    // Supprimer l'utilisateur existant s'il existe
    const existingUser = await userService.findByEmail(testEmail);
    if (existingUser) {
      await userService.deleteByEmail(testEmail);
      console.log('🗑️ Ancien utilisateur supprimé');
    }

    // Créer le nouvel utilisateur
    const newUser = await userService.create(testEmail, testPassword);
    console.log('✅ Nouvel utilisateur créé avec succès:');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}`);
    console.log(`🆔 ID: ${newUser.id}`);

    console.log('\n📝 Pour tester l\'API, utilisez ces données:');
    console.log('\n1. 🔐 Login (POST /auth/login):');
    console.log('curl -X POST http://localhost:3000/auth/login \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log(`  -d '{"email": "${testEmail}", "password": "${testPassword}"}'`);

    console.log('\n2. 👤 Après avoir récupéré le token, testez le profil (GET /profile):');
    console.log('curl -X GET http://localhost:3000/profile \\');
    console.log('  -H "Authorization: Bearer <YOUR_TOKEN>"');

    console.log('\n3. ✨ Créer un créateur (POST /creators):');
    console.log('curl -X POST http://localhost:3000/creators \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -H "Authorization: Bearer <YOUR_TOKEN>" \\');
    console.log('  -d \'{"username": "creatorX", "monthlyPrice": 499}\'');

    console.log('\n4. 🔍 Récupérer un créateur (GET /creators/:username):');
    console.log('curl -X GET http://localhost:3000/creators/creatorX \\');
    console.log('  -H "Authorization: Bearer <YOUR_TOKEN>"');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await app.close();
  }
}

createTestUser();
