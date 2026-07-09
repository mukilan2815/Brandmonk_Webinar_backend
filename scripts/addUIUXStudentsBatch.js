const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// New UI/UX Design students for June MES batch
// These will be assigned certificate IDs starting from BMAJUNUIMES/Q0306S001
const newStudentNames = [
  'Cabrio',
  'Lakshmanan',
  'Mahalakshmi N',
  'Sneha T',
  'Maha Swetha T',
  'Hanisha',
  'Gowtham',
  'Vishnu P',
  'Manoj G',
  'S VISHNUDURGA',
  'Pavithran',
  'KANIMOZHI K',
  'kamalanathan',
  'Abirami',
  'Arunkumar Shanmugam',
  'DURGA M',
  'KALAI VANI',
  'Reshma',
  'Hanistan',
  'Shobika',
  'Dheena',
  'Rupesh Radhev R',
  'Sabari',
  'vasanth',
  'sudhakaran',
  'Vivek P',
  'K VAISHALI',
  'SARANYA CHINNATHAMBI',
  'JAGANATH D',
  'Vedhasri Rajamanickam',
  'SUJITHA SHANMUGAM',
  'Arun',
  'S SARMILA',
  'Ajithkumar M',
  'CHRISWIN D GESILDEV',
  'Dhinesh',
  'Gayathiri C',
  'Dheena',
  'Dinesh Raj',
  'Vignesh',
  'VIJAYA B',
  'SHIVAPRIYAA S',
  'Palaniyammal',
  'Deepa sri',
  'Askhaya',
  'Kamalakannan',
  'Varshaan',
  'Praiselin N',
  'Aarthi',
  'Monica G',
  'Vijayakumar V',
  'Malaviga R',
  'Santhakumar S',
  'S Aravinth Kumar',
  'Ganesh Kumar',
  'Mohamed Jaffar',
  'Srirengabalakrishnan V',
  'Vijay Nagarjun A B',
  'Gokulnath',
  'Dinesh Manimuthu',
  'Vasanthakumar M',
  'Ritheesh M',
  'Sathish Kumar A',
  'Kopperundevi N',
  'Naveena Venkat',
  'Daniel G',
  'Kishore S',
  'Sugavanam R',
  'Sarulatha G',
  'Kanishkar J N',
  'SARUMATHI R',
  'Shanmathi P',
  'Sharmila T'
];

const COURSE_NAME = 'UI/UX Design';
const COURSE_SLUG = 'ui-ux';
const CERT_PREFIX = 'BMAJUNUIMES/Q0306S';

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
        const match = s.certificateId.match(/Q0306S(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });

    let nextNum = maxNum + 1;
    console.log(`🎨 Next available ${CERT_PREFIX} number: ${nextNum.toString().padStart(3, '0')}`);
    console.log(`📋 Students to process: ${newStudentNames.length}\n`);

    let added = 0;
    let skipped = 0;
    let failed = 0;
    const failedList = [];

    for (const name of newStudentNames) {
      const normalizedName = normalizeName(name);

      // Skip if name already exists in UI/UX course
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
    console.log(`📈 Total UI/UX students in DB: ${finalCount}`);
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
