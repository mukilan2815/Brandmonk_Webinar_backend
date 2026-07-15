const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_SLUG = 'artificial-intelligence';

const phoneData = [
  { name: 'Jeba Singh P', mobile: '9600588589' },
  { name: 'Santhosh M', mobile: '6383571388' },
  { name: 'Ramesh Iyyappan', mobile: '9943059921' },
  { name: 'Manjula T', mobile: '9884551223' },
  { name: 'Ramakrishnan N', mobile: '8870930168' },
  { name: 'Mohamed Thowfeeq Basha', mobile: '6385808851' }
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
