const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// New Digital Marketing students for June MES batch
// These correspond to certificate IDs BMAJUNDMMES/Q0506S101 and onwards
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
  'Vanumalai Perumal M',
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
  'Narmathan P',
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
  'Ragu Waran',
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
  'kandahari',
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

// Build student objects with certificate IDs starting from S101
const START_NUMBER = 101;
const studentsToAdd = newStudentNames.map((name, index) => ({
  name: name.trim(),
  certificateId: `BMAJUNDMMES/Q0506S${(START_NUMBER + index).toString().padStart(3, '0')}`,
  courseName: 'Digital Marketing',
  courseSlug: 'digital-marketing'
}));

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

    const existingStudents = await CourseStudent.find({ courseSlug: 'digital-marketing' });
    const existingCertIds = new Set(existingStudents.map(s => s.certificateId));
    const existingNames = new Set(existingStudents.map(s => normalizeName(s.name)));

    let added = 0;
    let skipped = 0;
    let failed = 0;
    const failedList = [];

    console.log(`📋 Students to process: ${studentsToAdd.length}\n`);

    for (const student of studentsToAdd) {
      // Skip if certificate ID already exists
      if (existingCertIds.has(student.certificateId)) {
        console.log(`⏭️  Skipped (cert ID exists): ${student.name} → ${student.certificateId}`);
        skipped++;
        continue;
      }

      // Skip if normalized name already exists in DM
      if (existingNames.has(normalizeName(student.name))) {
        console.log(`⏭️  Skipped (name exists): ${student.name}`);
        skipped++;
        continue;
      }

      try {
        const newStudent = new CourseStudent({
          name: student.name,
          courseName: student.courseName,
          courseSlug: student.courseSlug,
          certificateId: student.certificateId,
          isEligible: true,
          certificateSent: false,
          dateOfRegistration: new Date()
        });

        await newStudent.save();
        console.log(`✅ Added: ${student.name} → ${student.certificateId}`);
        added++;
        existingCertIds.add(student.certificateId);
        existingNames.add(normalizeName(student.name));
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Skipped (duplicate key): ${student.name} → ${student.certificateId}`);
          skipped++;
        } else {
          console.error(`❌ Error adding ${student.name}: ${error.message}`);
          failed++;
          failedList.push({ name: student.name, certificateId: student.certificateId, error: error.message });
        }
      }
    }

    const finalCount = await CourseStudent.countDocuments({ courseSlug: 'digital-marketing' });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Added: ${added}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total DM students in DB: ${finalCount}`);
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
      certificateId: { $regex: /^BMAJUNDMMES\/Q0506S1/ }
    }).limit(5).sort({ certificateId: 1 });
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
