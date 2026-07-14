const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_NAME = 'Data Analytics';
const COURSE_SLUG = 'data-analytics';
const CERT_PREFIX = 'BMAJUNDAMES/Q0906S';

const daStudents = [
  'Siva Subramanian A',
  'Arun P M',
  'Eswar sudhan',
  'Anish Alex A',
  'Daniel S',
  'Gowshik B',
  'Hepsiba L',
  'S Vinoth Kumar',
  'Sanjay N',
  'R Poornima',
  'Senthamilselvi R',
  'Thinega R S',
  'Madhumathi M',
  'Pranesh B',
  'Arun G',
  'Suriya',
  'Naleef Ahamed',
  'Mohammed ummar Shaifudeen',
  'Yuvaraja K',
  'Mohamed shajith'
];

async function resetStudents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const deleteResult = await CourseStudent.deleteMany({ courseSlug: COURSE_SLUG });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing Data Analytics students\n`);

    const docs = daStudents.map((name, index) => ({
      name: name,
      courseName: COURSE_NAME,
      courseSlug: COURSE_SLUG,
      certificateId: `${CERT_PREFIX}${(index + 1).toString().padStart(3, '0')}`,
      isEligible: true,
      certificateSent: false,
      dateOfRegistration: new Date()
    }));

    await CourseStudent.insertMany(docs);
    console.log(`✅ Added ${docs.length} Data Analytics students\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🗑️  Deleted: ${deleteResult.deletedCount}`);
    console.log(`✅ Added: ${docs.length}`);
    console.log(`📈 Total DA students: ${docs.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

resetStudents();
