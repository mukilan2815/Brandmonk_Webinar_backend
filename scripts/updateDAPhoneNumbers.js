const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_SLUG = 'data-analytics';

const phoneData = [
  { name: 'Siva Subramanian A', mobile: '6374584636' },
  { name: 'Arun P M', mobile: '9486798060' },
  { name: 'Eswar sudhan', mobile: '9944231557' },
  { name: 'Anish Alex A', mobile: '8072951708' },
  { name: 'Daniel S', mobile: '7538823849' },
  { name: 'Gowshik B', mobile: '9486861998' },
  { name: 'Hepsiba L', mobile: '7708684330' },
  { name: 'S Vinoth Kumar', mobile: '7695885938' },
  { name: 'Sanjay N', mobile: '7339082843' },
  { name: 'R Poornima', mobile: '8523928625' },
  { name: 'Senthamilselvi R', mobile: '9600714746' },
  { name: 'Thinega R S', mobile: '8148951648' },
  { name: 'Madhumathi M', mobile: '6374159715' },
  { name: 'Pranesh B', mobile: '9003545196' },
  { name: 'Arun G', mobile: '9360619621' },
  { name: 'Suriya', mobile: '7200839309' },
  { name: 'Naleef Ahamed', mobile: '8903869645' },
  { name: 'Mohammed ummar Shaifudeen', mobile: '6382103199' },
  { name: 'Yuvaraja K', mobile: '6369084524' },
  { name: 'Mohamed shajith', mobile: '7397672178' }
];

async function updatePhoneNumbers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    let notFound = 0;

    for (const item of phoneData) {
      const cleanMobile = item.mobile.replace(/\D/g, '');

      const student = await CourseStudent.findOne({
        courseSlug: COURSE_SLUG,
        name: { $regex: new RegExp('^' + item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
      });

      if (student) {
        student.phoneNumber = cleanMobile;
        await student.save();
        console.log(`✅ Updated: ${student.name} → ${cleanMobile}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${item.name}`);
        notFound++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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

updatePhoneNumbers();
