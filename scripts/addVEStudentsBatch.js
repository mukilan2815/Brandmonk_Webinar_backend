const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// New Video Editing students for June MES batch
// These will be assigned certificate IDs starting from the next available BMAJUNVEMES/Q1401S number
const newStudentNames = [
  'R N Charan Raj',
  'Anish Kumar J',
  'MELWINREX SOLOMON',
  'Indira',
  'S Kumar',
  'Satheesh kumar',
  'RAJA MOHAMED B',
  'Dhaneesh G',
  'Anutha V',
  'RAMYA MURUGAN M',
  'Maari',
  'M DINESH',
  'Sangeethkumar S',
  'MUNIRAJ T',
  'Dineshkumar R',
  'MOHAMMED AKHATHU',
  'OmPrakash S',
  'Jubinesh',
  'Ganavel P',
  'George G',
  'MANIVANNAN M',
  'Senthil Kumar',
  'VASANTHAN K',
  'ROHITH SABAPANI',
  'Anitha Vignesh',
  'Asmitha Vaishnavi S',
  'Boobalan R',
  'MOHAMMED SAZSA',
  'VELMURUGAN S',
  'SHARMILA R',
  'Arun Prasath B',
  'Vijay',
  'Suresh',
  'VELU JAYASEELAN',
  'Tamil',
  'Noorul Afiya H',
  'Gowtham Nirmal',
  'Arvind Kumar P',
  'Jai',
  'Supriya',
  'Prasino',
  'Satheesh',
  'S Sakthipriya',
  'Ragavi',
  'Gomathy D',
  'SANJAI K',
  'Manoj',
  'R KANCHANADEVI',
  'Upendra C',
  'Prem Kumar',
  'Devendran',
  'Rajesh P',
  'Devadharsini',
  'Gokul S',
  'Surya K',
  'Kaleeswari',
  'Santhosh',
  'Vijaya Ananth VS',
  'R K Ramanan',
  'Ramsingh',
  'Parameswaran Selvakumar',
  'Kiran Karthick',
  'Farzis Fathima M',
  'SHANGAVI T',
  'Santhiya Raj',
  'Nirmalraj Gunasekar',
  'VEENA SELVAN',
  'varalakshmi',
  'RIYAZUNNISA JAINULABUDEEN',
  'sameen Afrose M',
  'Kavinraj',
  'MOHAN DOSS',
  'Kiran Kumar',
  'MARIA M',
  'Vighash',
  'Nijanthan Raj N',
  'manikandan',
  'Kanniraj P',
  'Kavitha',
  'Saraswathi',
  'Chandrasekhar E',
  'CHODA SUSHMA',
  'Santhosh S',
  'Iswarya Ramadoss',
  'Jayasree Sridhar',
  'Serose',
  'Abinaya B',
  'Nandhini Vellaisamy',
  'Bharath S',
  'Prabhakaran K',
  'AKSHAYA V',
  'Ramachandran P',
  'M PRAVEEN',
  'Chevvanthi',
  'Neela G',
  'Kanchanadevi',
  'Vignesh K',
  'Nizad U',
  'Sanjay Selvam',
  'Vivekanand P',
  'Ekramullah',
  'Sakthivel N',
  'James paulraj',
  'Syed Aashik',
  'PARTHIBAN S',
  'Muthu Raman',
  'sana',
  'Euvaraj Subramani',
  'Balakrishnan Appanasamy',
  'Padmanabhan S',
  'Arulprakash P',
  'Srinivas D',
  'A B Antony Gutenburg',
  'PRIYADHARSHINI',
  'Kamalakannan',
  'Rajesh',
  'Gowtham S',
  'Vinnarasi S',
  'Dineshkumar R',
  'Dharshan Babu B',
  'Komathi',
  'Monish',
  'Santhiya Sahayaraj',
  'Azahagendiran S',
  'Prabhu M',
  'Santhosh',
  'Vivek',
  'R SUGANTHI',
  'Balasubramanian E',
  'Iswarya',
  'KRISHNAVENI SELVAN',
  'SANGEETHA V',
  'Kaleeswari'
];

const COURSE_NAME = 'Advanced Video Editing (AI-Integrated)';
const COURSE_SLUG = 'video-editing';
const CERT_PREFIX = 'BMAJUNVEMES/Q1401S';

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

    // Find the highest existing BMAJUNVEMES/Q1401S certificate number
    let maxNum = 0;
    existingStudents.forEach(s => {
      if (s.certificateId && s.certificateId.startsWith(CERT_PREFIX)) {
        const match = s.certificateId.match(/Q1401S(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });

    let nextNum = maxNum + 1;
    console.log(`📹 Next available ${CERT_PREFIX} number: ${nextNum.toString().padStart(3, '0')}`);
    console.log(`📋 Students to process: ${newStudentNames.length}\n`);

    let added = 0;
    let skipped = 0;
    let failed = 0;
    const failedList = [];

    for (const name of newStudentNames) {
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
    console.log(`📈 Total VE students in DB: ${finalCount}`);
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
