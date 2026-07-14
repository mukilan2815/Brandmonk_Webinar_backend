const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_NAME = 'Advanced Digital Marketing (AI-Integrated)';
const COURSE_SLUG = 'digital-marketing';
const CERT_PREFIX = 'BMAJUNDMMES/Q0506S';

const newStudentNames = [
  'Saranraj M',
  'Balaji L',
  'George',
  'Faisal Rahuman J',
  'Samundeeswari P',
  'Lavanya',
  'Sandhiya Dharmaraj',
  'Madhusoothanan V',
  'Praveen Kumar',
  'Thaitamil',
  'Ganesh kangaraj',
  'Dharanidharan P',
  'Shruthi C M',
  'Vanumamalai Perumal M',
  'Divya R',
  'Surya B',
  'DANIEL S',
  'Sangeetha R',
  'Vijaya harshini',
  'Muthukumar G',
  'Mohamed Ashik A K',
  'SAVITHIRI C',
  'Mahesh R',
  'ARCHANA G',
  'Preethi (amma VALLIAMMAL G)',
  'Haripradeesh S',
  'Karthikeyan S',
  'GIRIJA R',
  'Deepan S',
  'Manjuladevi S',
  'Barath Kisore M',
  'Saranya M',
  'Brindha Ayyappan',
  'Mari selvi',
  'Salathiya A',
  'Uma R',
  'Kiran Raj P R',
  'Moganasundaram V',
  'Safrin Nihara A',
  'Sripriya J',
  'Saravanan R',
  'Nithish M',
  'Azif Alikhan S',
  'Lavanya S',
  'Pavithra G',
  'Saravanan G',
  'AROCKIARAJ SAMY',
  'Dhayanandhan V',
  'Shyam Arumugam',
  'Narmathan R',
  'Sivasaravanan K',
  'AMARNATH D',
  'RAMAPRABHA V',
  'guru',
  'Premnath K',
  'Subramani M',
  'Aasefa',
  'Sakthi Vigneswari M',
  'SAVINKUMAR K',
  'Uthirakumar G',
  'kaviya',
  'Samuel Solomon A',
  'Ranjith R',
  'Sowmiya M',
  'Devadharshini',
  'Naveen S',
  'Alphonse V',
  'Shhown Cyril Dsouza',
  'Harshavarthan J',
  'Kavitha G',
  'Pragathiswaran S',
  'Shafran Ruby',
  'Mathsur',
  'Ramkumar Bawa',
  'Sabitha Murugesan',
  'Raguwaran R',
  'Gowsalya V',
  'Nishali Sivakumar',
  'Sankareswari E',
  'Gayathri J',
  'S SAJINI',
  'Dhanusigasree R',
  'Vinothkumar M',
  'Govindaraj Rajagopal',
  'Nageshwari M',
  'Balaji S',
  'Reka THARMAR',
  'Nivasini Jayakumar',
  'Sowndharya S',
  'akshay',
  'Mahalakshmi K',
  'Mohan',
  'Abirami J S',
  'ARJUNAN A',
  'Karthini J B',
  'Balaji B',
  'Mohan Ganesan',
  'Karthick D',
  'Sherin S',
  'Safrin Begum M',
  'Manimala K',
  'Kather Batcha J',
  'Maria',
  'Gajalakshmi G',
  'Gayathri',
  'Mayajothi K',
  'Gokila P',
  'Abdul Latheef',
  'Ashwin Kumar S',
  'Sabarigirivasan V',
  'Boopathy C',
  'Karthick P',
  'Vikram R',
  'Vanmathi',
  'Padmavathy C',
  'Yokesh G',
  'Sakthika R',
  'Chitra Ramamurthi',
  'Navaneethan G',
  'Selva S',
  'Saravana Kumar',
  'Thapathi S',
  'Tamilarasan S',
  'Hariharan R',
  'ASHOKRAJ JAYABALU',
  'DHIVYA sri',
  'Kamalchand M',
  'Vignesh V',
  'John Abrakan',
  'Prakash Mani K M',
  'Rajendra Prasad',
  'Divya Bharathi E',
  'Kamalesh P',
  'Vasanthapriyan S',
  'Franklin S',
  'DIVAKAR K',
  'A Suganth Kishor',
  'Indhumathi D',
  'Arulpravin S',
  'Kannaiah G',
  'Gajendhiran G',
  'Sivambigai N',
  'Suman A',
  'SAFNA',
  'Jayalakshmi',
  'Manju R',
  'ALBERT LEO',
  'Gopika',
  'Anu',
  'kirthikarathi',
  'suresh',
  'Gayathiri',
  'Nirmala',
  'Inidha',
  'sandhiya',
  'Sai Rupa S',
  'Babu v',
  'Murugavelan',
  'Thangakarupu',
  'Ahameed',
  'kandhahari',
  'Madhan V',
  'Rekka',
  'Shalini S',
  'Mervin',
  'Tarun',
  'PRATHIMA G',
  'Kalidass',
  'Selvakumari P',
  'Kokila',
  'Swathi',
  'Surya',
  'S KIRUTHIKA',
  'Madhan Sanjay',
  'Ranjith',
  'SARAVANAN MUGIL',
  'Lavanya P',
  'Jeevanantham S',
  'Venkateshkumar',
  'Shanmugam Sundar',
  'John Joel',
  'U.JAYAKANTH',
  'Kathirvel',
  'Rajendra Prasath V',
  'Manikantha',
  'Lakshmipriya P',
  'roshan',
  'Hariprasad',
  'B.Surya Ganth'
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
        const match = s.certificateId.match(/Q0506S(\d+)/);
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
    console.log(`📈 Total DM students in DB: ${finalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

processStudents();
