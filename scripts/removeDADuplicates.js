const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function removeDuplicates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const allDAStudents = await CourseStudent.find({ courseSlug: 'data-analytics' }).sort({ certificateId: 1 });
    console.log(`📊 Found ${allDAStudents.length} Data Analytics students\n`);

    const seen = new Map();
    const duplicates = [];

    for (const student of allDAStudents) {
      const key = normalizeName(student.name);
      if (seen.has(key)) {
        duplicates.push(student);
      } else {
        seen.set(key, student);
      }
    }

    console.log(`✅ Unique names: ${seen.size}`);
    console.log(`❌ Duplicates to remove: ${duplicates.length}\n`);

    if (duplicates.length > 0) {
      console.log('🗑️  Duplicates being deleted:');
      console.log('==========================================');
      duplicates.forEach(s => {
        console.log(`   ${s.name} → ${s.certificateId}`);
      });
      console.log('');

      const idsToDelete = duplicates.map(s => s._id);
      const deleteResult = await CourseStudent.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`🗑️  Deleted ${deleteResult.deletedCount} duplicate students\n`);
    } else {
      console.log('✅ No duplicates found\n');
    }

    const finalCount = await CourseStudent.countDocuments({ courseSlug: 'data-analytics' });
    console.log('========================================');
    console.log('📊 FINAL SUMMARY');
    console.log('========================================');
    console.log(`📊 Total Data Analytics students: ${finalCount}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

removeDuplicates();
