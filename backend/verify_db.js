import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './src/models/Company.js';
import User from './src/models/User.js';

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const companies = await Company.find().sort({ createdAt: -1 }).limit(3).populate('user', 'name email username');

        console.log('\n--- Recent Companies ---');
        companies.forEach(comp => {
            console.log(`\nCompany: ${comp.companyName}`);
            console.log(`User: ${comp.user?.email} (${comp.user?.username})`);
            console.log(`Industry: ${comp.industry}`);
            console.log(`Size: ${comp.size}`);
            console.log(`Changes Persisted? -> Founded: ${comp.foundedYear}, Phone: ${comp.contactPhone}`);
            console.log(`Created At: ${comp.createdAt}`);
        });

        if (companies.length === 0) {
            console.log('No companies found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
