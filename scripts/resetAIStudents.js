const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_NAME = 'Artificial Intelligence';
const COURSE_SLUG = 'artificial-intelligence';
const CERT_PREFIX = 'BMAJUNAIMES/Q0806S';

const aiStudents = [
  'Jeba Singh P',
  'Santhosh M',
  'Ramesh Iyyappan',
  'Manjula T',
  'Ramakrishnan N',
  'Mohamed Thowfeeq Basha'
];

async function resetStudents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const deleteResult = await CourseStudent.deleteMany({ courseSlug: COURSE_SLUG });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing Artificial Intelligence students\n`);

    const docs = aiStudents.map((name, index) => ({
      name: name,
      courseName: COURSE_NAME,
      courseSlug: COURSE_SLUG,
      certificateId: `${CERT_PREFIX}${(index + 1).toString().padStart(3, '0')}`,
      isEligible: true,
      certificateSent: false,
      dateOfRegistration: new Date()
    }));

    await CourseStudent.insertMany(docs);
    console.log(`✅ Added ${docs.length} Artificial Intelligence students\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🗑️  Deleted: ${deleteResult.deletedCount}`);
    console.log(`✅ Added: ${docs.length}`);
    console.log(`📈 Total AI students: ${docs.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

resetStudents();
