const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// New Data Analytics students for June MES batch
// These will be assigned certificate IDs starting from BMAJUNDAMES/Q0906S001
const newStudentNames = [
  'Siva Subramanian A',
  'Arun P M',
  'Eswar sudhan',
  'Anish',
  'Daniel S',
  'GOWSHIK B',
  'Hepsiba L',
  'Vinoth',
  'Sanjay N',
  'R Poornima',
  'SENTHAMILSELVI R',
  'Thinega R S',
  'Madhumathi M',
  'Pranesh B',
  'Arun G',
  'Surya',
  'Naleef Ahamed',
  'Mohammed ummar Shaifudeen',
  'Yuvaraja K',
  'Mohamed shajith'
];

const COURSE_NAME = 'Data Analytics';
const COURSE_SLUG = 'data-analytics';
const CERT_PREFIX = 'BMAJUNDAMES/Q0906S';

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function addStudents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const existingStudents = await CourseStudent.find({ courseSlug: COURSE_SLUG });
    const existingCertIds = new Set(existingStudents.map(s => s.certificateId));
    const existingNames = new Set(existingStudents.map(s => normalizeName(s.name)));

    // Find the highest existing certificate number for this prefix
    let maxNum = 0;
    existingStudents.forEach(s => {
      if (s.certificateId && s.certificateId.startsWith(CERT_PREFIX)) {
        const match = s.certificateId.match(/Q0906S(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });

    let nextNum = maxNum + 1;
    console.log(`📊 Next available ${CERT_PREFIX} number: ${nextNum.toString().padStart(3, '0')}`);
    console.log(`📋 Students to process: ${newStudentNames.length}\n`);

    let added = 0;
    let skipped = 0;
    let failed = 0;
    const failedList = [];

    for (const name of newStudentNames) {
      const normalizedName = normalizeName(name);

      // Skip if name already exists in Data Analytics course
      if (existingNames.has(normalizedName)) {
        console.log(`⏭️  Skipped (name exists): ${name}`);
        skipped++;
        continue;
      }

      const certificateId = `${CERT_PREFIX}${nextNum.toString().padStart(3, '0')}`;

      // Safety check: skip if cert ID somehow already exists
      if (existingCertIds.has(certificateId)) {
        console.log(`⚠️  Cert ID collision, skipping: ${name} → ${certificateId}`);
        skipped++;
        nextNum++;
        continue;
      }

      try {
        const newStudent = new CourseStudent({
          name: name.trim(),
          courseName: COURSE_NAME,
          courseSlug: COURSE_SLUG,
          certificateId: certificateId,
          isEligible: true,
          certificateSent: false,
          dateOfRegistration: new Date()
        });

        await newStudent.save();
        console.log(`✅ Added: ${name} → ${certificateId}`);
        added++;
        existingNames.add(normalizedName);
        existingCertIds.add(certificateId);
        nextNum++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Skipped (duplicate key): ${name} → ${certificateId}`);
          skipped++;
        } else {
          console.error(`❌ Error adding ${name}: ${error.message}`);
          failed++;
          failedList.push({ name, certificateId, error: error.message });
        }
      }
    }

    const finalCount = await CourseStudent.countDocuments({ courseSlug: COURSE_SLUG });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Added: ${added}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total Data Analytics students in DB: ${finalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (failedList.length > 0) {
      console.log('❌ Failed entries:');
      failedList.forEach(item => {
        console.log(`   - ${item.name} (${item.certificateId}): ${item.error}`);
      });
      console.log('');
    }

    // Print sample verification URLs
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 SAMPLE VERIFICATION URLs');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const sampleStudents = await CourseStudent.find({
      certificateId: { $regex: new RegExp(`^${CERT_PREFIX}`) }
    }).sort({ certificateId: -1 }).limit(5);
    sampleStudents.forEach(s => {
      console.log(`- ${s.name}: https://brandmonkacademy.com/verify/course/${encodeURIComponent(s.certificateId)}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

addStudents();
