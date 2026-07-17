const mongoose = require('mongoose');
const path = require('path');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mukilan:mukilan@cluster0.c5yb5jt.mongodb.net/brandmonk_academy?appName=Cluster0';

// Two new Digital Marketing students to add
const newStudents = [
  { name: 'Radhamani S', phoneNumber: '8344667695' },
  { name: 'Rekha', phoneNumber: '9787250572' }
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected\n');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const addStudents = async () => {
  await connectDB();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Adding 2 New Digital Marketing Students');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const courseSlug = 'digital-marketing';
  const courseName = 'Digital Marketing';

  // Get all DM students to check duplicates and find the highest certificate sequence
  const existingStudents = await CourseStudent.find({ courseSlug });
  const existingNames = new Set(
    existingStudents.map(s => (s.name || '').toLowerCase().trim())
  );

  let maxNum = 0;
  const idPattern = /^BMAJUNDMMES\/Q0506S(\d+)$/;

  existingStudents.forEach(s => {
    if (s.certificateId) {
      const match = s.certificateId.match(idPattern);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  });

  console.log(`Current highest BMAJUNDMMES/Q0506S certificate number: S${String(maxNum).padStart(3, '0')}`);
  console.log(`Total existing DM students: ${existingStudents.length}\n`);

  let inserted = 0;
  let skipped = 0;
  let currentNum = maxNum;
  const addedStudents = [];

  for (const student of newStudents) {
    const normalizedName = student.name.toLowerCase().trim();

    if (existingNames.has(normalizedName)) {
      console.log(`⏭️ Already exists: ${student.name}`);
      skipped++;
      continue;
    }

    currentNum++;
    const certId = `BMAJUNDMMES/Q0506S${String(currentNum).padStart(3, '0')}`;

    // Final safety check to avoid certificateId collision
    const existingCert = await CourseStudent.findOne({ certificateId: certId });
    if (existingCert) {
      console.error(`❌ Certificate ID collision for ${certId}. Skipping ${student.name}.`);
      skipped++;
      continue;
    }

    try {
      const newStudent = new CourseStudent({
        name: student.name.trim(),
        courseName,
        courseSlug,
        certificateId: certId,
        phoneNumber: student.phoneNumber.trim(),
        isEligible: true,
        certificateSent: false,
        dateOfRegistration: new Date()
      });

      await newStudent.save();
      console.log(`✅ Added: ${student.name} (${certId})`);
      addedStudents.push({ name: student.name, certificateId: certId, phoneNumber: student.phoneNumber });
      inserted++;
      existingNames.add(normalizedName);
    } catch (err) {
      console.error(`❌ Error adding ${student.name}: ${err.message}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Inserted: ${inserted}`);
  console.log(`⏭️ Skipped: ${skipped}`);

  if (addedStudents.length > 0) {
    console.log('\n📋 New Students Added:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addedStudents.forEach(s => {
      console.log(`  Name : ${s.name}`);
      console.log(`  Phone: ${s.phoneNumber}`);
      console.log(`  Certificate ID: ${s.certificateId}`);
      console.log(`  Verify URL: https://brandmonkacademy.com/verify/${s.certificateId}`);
      console.log('');
    });
  }

  const total = await CourseStudent.countDocuments({ courseSlug });
  console.log(`📊 Total Digital Marketing Students: ${total}\n`);

  await mongoose.connection.close();
  process.exit(0);
};

addStudents();
