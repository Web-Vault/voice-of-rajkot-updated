import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const runSeeders = async () => {
      try {
            console.log('🌱 Starting database seeding process...');

            // Run seeders in sequence
            console.log('\n📊 Running User Seeder...');
            await execPromise('node userSeeder.js');

            console.log('\n📊 Running Event Seeder...');
            await execPromise('node eventSeeder.js');

            console.log('\n📊 Running Post Seeder...');
            await execPromise('node postSeeder.js');

            console.log('\n📊 Running Booking Seeder...');
            await execPromise('node bookingSeeder.js');

            console.log('\n✅ All data seeded successfully!');
            process.exit();
      } catch (error) {
            console.error(`\n❌ Error seeding data: ${error.message}`);
            process.exit(1);
      }
};

// Run all seeders
runSeeders();