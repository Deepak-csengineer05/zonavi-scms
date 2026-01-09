import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:');
            console.log(`  Email: ${existingAdmin.email}`);
            console.log(`  Username: ${existingAdmin.username}`);
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@scms.com',
            password: 'admin123', // Change this after first login!
            name: 'System Administrator',
            branch: 'Administration',
            role: 'admin',
            isEmailVerified: true,
            cgpa: 0,
            year: 1
        });

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('  Login Credentials:');
        console.log('  ------------------');
        console.log('  Email:    admin@scms.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('  ⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
