const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// New batch students per course - certificate IDs continue from existing sequences
const COURSES = {
  'artificial-intelligence': {
    courseName: 'Artificial Intelligence',
    prefix: 'BMASEPAIMES/Q0806S',
    regex: /Q0806S(\d+)/,
    students: [
      'Ramesh',
      'Manjula'
    ]
  },
  'data-analytics': {
    courseName: 'Data Analytics',
    prefix: 'BMASEPDAMES/Q0906S',
    regex: /Q0906S(\d+)/,
    students: [
      'Anish Alex A',
      'S Vinoth Kumar',
      'Pranesh B',
      'R Poornima',
      'Arun G'
    ]
  },
  'digital-marketing': {
    courseName: 'Digital Marketing',
    prefix: 'BMASEPDMMES/Q0506S',
    regex: /Q0506S(\d+)/,
    students: [
      'Barath Kisore M',
      'Farzis Fathima M',
      'Franklin S',
      'Haripradeesh S',
      'Kamalchand M',
      'Karthikeyan S',
      'Lavanya S',
      'Mohamed Ashik A K',
      'Padmavathy C',
      'Samuel Solomon A',
      'Saranya M',
      'Shafran Ruby',
      'Shhown Cyril Dsouza',
      'Saraswathi',
      'Abishek D',
      'Ashwin Kumar S',
      'Chippy B',
      'Hajira Hadi M',
      'JEEVA V',
      'Joni Janarthanan C',
      'G Khannaiah',
      'Karthick D',
      'Kavinsanjay M V',
      'Kiruthika S',
      'Kugunesh V',
      'Logesh Khanna M.A',
      'Mahalakshmi K',
      'Mariyappan E',
      'Masarif Ahamed',
      'N SARASWATHI',
      'Naveen S',
      'Nithish M',
      'Ranjith R',
      'Sankareswari E',
      'Saranraj M',
      'Yokesh G',
      'Kaleeswari',
      'Divakar',
      'Sai Rupa S',
      'Bala Murugavel M',
      'ASHOKRAJ JAYABALU',
      'Gayathri J',
      'Gowsalya V',
      'Preethi (VALLIAMMAL G)',
      'Sandhiya Dharmaraj',
      'Jamurradhee Meenakshi',
      'VASANTHAKUMARI SIVAKUMAR',
      'Yuva Shankari S',
      'GOKULAKRISHNAN K',
      'Logeshwaran S',
      'Praveen Raj V',
      'Keerthana',
      'Praveena T',
      'ALBERT LEO',
      'Gopika',
      'Inidha',
      'Gowtham',
      'Eswar Sabari S',
      'Thangakaruppu K',
      'Ammar Ahamed H',
      'Abinaya B',
      'L AROCKIA RAJ',
      'Reka T',
      'Vivekanandan G',
      'Miruna M',
      'B Naga Prabhu',
      'Gajalakshmi G',
      'Nisha N',
      'Devadharshini K',
      'Mathews',
      'Nirmal S',
      'Magesh K',
      'Syed Aaqib S N'
    ]
  },
  'video-editing': {
    courseName: 'Advanced Video Editing (AI-Integrated)',
    prefix: 'BMASEPVEMES/Q1401S',
    regex: /Q1401S(\d+)/,
    students: [
      'A B Antony Gutenburg',
      'Arun Prasath B',
      'Bharath S',
      'Euvaraj Subramani',
      'M JOHN DINESH',
      'Manikandan I',
      'OmPrakash S',
      'R N Charan Raj',
      'R SUGANTHI',
      'Rajesh P',
      'Ramachandran P',
      'RAMYA MURUGAN M',
      'Vijay',
      'Vinnarasi S',
      'Anbukarasan M',
      'Ashaz Ahmed R',
      'Balaji R',
      'Jenibar M',
      'M Sham Kumar',
      'MOHAMMED AKHATHU',
      'Nijanthan Raj N',
      'Prabhuram A',
      'S Sakthipriya',
      'Saravanan V',
      'Thilagaraj S',
      'Vimalraj N',
      'Ramsingh',
      'MOHAN DOSS',
      'Prasino',
      'PRIYADHARSHINI',
      'Suresh',
      'Surya K',
      'Sudha k',
      'Monish',
      'GOPINATH RAMANI',
      'Sameeha A',
      'Ithrees A',
      'B Manikandan',
      'Sanjay',
      'Kamalakannan T',
      'Padmanabhan S',
      'Srinivas D',
      'Udayaraj Kadri',
      'Arul',
      'PARTHIBAN S',
      'Muthuraman S',
      'Priyadharshini R',
      'Hariharasudhan R',
      'Harish Kumar S',
      'Sambathraj D',
      'NANDHAGOPAL K',
      'DIVISH R S',
      'Tamilarasi',
      'Shangavi S M',
      'Haridasan. G',
      'Liyashini.G',
      'Saravanan A',
      'Kaviyarasu V',
      'S MUTHURAMAN',
      'Sitheswar R',
      'George Peter G',
      'Sharuk Basha S',
      'B.Abinaya'
    ]
  },
  'ui-ux': {
    courseName: 'UI/UX Design',
    prefix: 'BMASEPUIMES/Q0306S',
    regex: /Q0306S(\d+)/,
    students: [
      'K VAISHALI',
      'Sri Renga Bala Krishnan V',
      'Sudhakaran M',
      'Vasanthakumar M',
      'Vijaya Baskar',
      'Cibesh G K',
      'Dharun P',
      'Gokulraj N',
      'Mohamed Rafeek',
      'Shanmathi P',
      'Vijay Nagarjun A B',
      'Naveena V',
      'Ajithkumar M',
      'Kevin Kingsley C',
      'Resma S',
      'Naveena',
      'Sabari A',
      'Kamalanathan',
      'Dheena T',
      'Veronika S',
      'Hanistan A',
      'Arun V',
      'Dineshkumar K'
    ]
  }
};

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

    let totalAdded = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    for (const [slug, config] of Object.entries(COURSES)) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📚 ${config.courseName} (${slug})`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const existingStudents = await CourseStudent.find({ courseSlug: slug });
      const existingCertIds = new Set(existingStudents.map(s => s.certificateId));
      const existingNames = new Set(existingStudents.map(s => normalizeName(s.name)));

      // Find the highest existing certificate number for this prefix
      let maxNum = 0;
      existingStudents.forEach(s => {
        if (s.certificateId && s.certificateId.startsWith(config.prefix)) {
          const match = s.certificateId.match(config.regex);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });

      let nextNum = maxNum + 1;
      console.log(`🔢 Next available ${config.prefix} number: ${nextNum.toString().padStart(3, '0')}`);
      console.log(`📋 Students to process: ${config.students.length}\n`);

      let added = 0;
      let skipped = 0;
      let failed = 0;
      const failedList = [];

      for (const name of config.students) {
        const normalizedName = normalizeName(name);

        // Skip if name already exists in this course
        if (existingNames.has(normalizedName)) {
          console.log(`⏭️  Skipped (name exists): ${name}`);
          skipped++;
          continue;
        }

        const certificateId = `${config.prefix}${nextNum.toString().padStart(3, '0')}`;

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
            courseName: config.courseName,
            courseSlug: slug,
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

      console.log(`\n📊 ${config.courseName} Summary: ${added} added, ${skipped} skipped, ${failed} failed\n`);

      if (failedList.length > 0) {
        console.log('❌ Failed entries:');
        failedList.forEach(item => {
          console.log(`   - ${item.name} (${item.certificateId}): ${item.error}`);
        });
        console.log('');
      }

      totalAdded += added;
      totalSkipped += skipped;
      totalFailed += failed;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TOTAL SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Added: ${totalAdded}`);
    console.log(`⏭️  Skipped: ${totalSkipped}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

addStudents();
