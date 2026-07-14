const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_NAME = 'Data Analytics';
const COURSE_SLUG = 'data-analytics';
const CERT_PREFIX = 'BMAJUNDAMES/Q0906S';

const newStudentNames = [
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

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function processStudents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const existingStudents = await CourseStudent.find({ courseSlug: COURSE_SLUG });
    const existingNames = new Set(existingStudents.map(s => normalizeName(s.name)));
    const existingCertIds = new Set(existingStudents.map(s => s.certificateId));

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

    const existingList = [];
    const missingList = [];

    for (const name of newStudentNames) {
      const normalizedName = normalizeName(name);
      if (existingNames.has(normalizedName)) {
        const found = existingStudents.find(s => normalizeName(s.name) === normalizedName);
        existingList.push({ name, certificateId: found?.certificateId || 'N/A' });
      } else {
        missingList.push(name);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 EXISTING STUDENTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (existingList.length === 0) {
      console.log('None of these students exist in the database.\n');
    } else {
      console.log(`Found ${existingList.length} existing students:\n`);
      existingList.forEach(s => {
        console.log(`   ✅ ${s.name} → ${s.certificateId}`);
      });
      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('➕ MISSING STUDENTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (missingList.length === 0) {
      console.log('All students already exist. Nothing to add.\n');
    } else {
      console.log(`Found ${missingList.length} missing students:\n`);
      missingList.forEach(name => {
        console.log(`   ➕ ${name}`);
      });
      console.log('');
    }

    let added = 0;
    let skipped = 0;
    let failed = 0;
    let nextNum = maxNum + 1;

    if (missingList.length > 0) {
      console.log('📝 Adding missing students...\n');
      for (const name of missingList) {
        const certificateId = `${CERT_PREFIX}${nextNum.toString().padStart(3, '0')}`;

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
          existingNames.add(normalizeName(name));
          existingCertIds.add(certificateId);
          nextNum++;
        } catch (error) {
          if (error.code === 11000) {
            console.log(`⚠️  Skipped (duplicate key): ${name} → ${certificateId}`);
            skipped++;
          } else {
            console.error(`❌ Error adding ${name}: ${error.message}`);
            failed++;
          }
        }
      }
    }

    const finalCount = await CourseStudent.countDocuments({ courseSlug: COURSE_SLUG });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔍 Existing: ${existingList.length}`);
    console.log(`➕ Missing: ${missingList.length}`);
    console.log(`✅ Added: ${added}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total DA students in DB: ${finalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

processStudents();
