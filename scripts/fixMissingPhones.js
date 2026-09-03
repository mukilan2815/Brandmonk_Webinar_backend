const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// Students reported NOT FOUND by updateStudentPhones.js
// (they exist in the DB but under a different course than the provided list)
const fixes = [
  { name: 'Sharuk Basha S', phone: '8248807868' },
  { name: 'Syed Aaqib S N', phone: '9940249846' }
];

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

function cleanPhone(phone) {
  return (phone || '').replace(/\D/g, '');
}

async function fixPhones() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    let notFound = 0;

    for (const fix of fixes) {
      const phone = cleanPhone(fix.phone);
      const targetNorm = normalizeName(fix.name);

      // Search across ALL courses since the course in the list may not match the DB
      const allStudents = await CourseStudent.find({});
      const match = allStudents.find(s => normalizeName(s.name) === targetNorm);

      if (!match) {
        console.log(`❌ NOT FOUND: ${fix.name}`);
        notFound++;
        continue;
      }

      match.phoneNumber = phone;
      await match.save();
      console.log(`✅ Updated: ${match.name} | ${match.courseName} | ${match.certificateId} → ${phone}`);
      updated++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Not found: ${notFound}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

fixPhones();
