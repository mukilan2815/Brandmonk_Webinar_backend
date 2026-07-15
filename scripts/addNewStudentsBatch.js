const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const courseConfig = {
  DM: {
    courseName: 'Digital Marketing',
    courseSlug: 'digital-marketing',
    prefix: 'BMADM'
  },
  UIUX: {
    courseName: 'UI/UX',
    courseSlug: 'ui-ux',
    prefix: 'BMAUI'
  },
  VE: {
    courseName: 'Video Editing',
    courseSlug: 'video-editing',
    prefix: 'BMAVE'
  }
};

const rawStudents = [
  // Digital Marketing
  { name: 'Nirmal Raj', mobile: '9585989422', courseCode: 'DM' },
  { name: 'Harish M R', mobile: '63813 80338', courseCode: 'DM' },
  { name: 'Naveen Vinayak S', mobile: '80722 00478', courseCode: 'DM' },
  { name: 'Lakshmi Durgaa M', mobile: '82208 07063', courseCode: 'DM' },
  { name: 'Abuthahir J', mobile: '99414 14311', courseCode: 'DM' },
  { name: 'Gayathri V', mobile: '63811 77980', courseCode: 'DM' },
  { name: 'SANDHIYA S', mobile: '7339156662', courseCode: 'DM' },
  { name: 'ABINAYA M', mobile: '6384770177', courseCode: 'DM' },
  { name: 'DHAYANANDHAN V', mobile: '9629188627', courseCode: 'DM' },
  { name: 'NAVEENKUMAR M', mobile: '9445883101', courseCode: 'DM' },

  // UI/UX
  { name: 'Dinesh Kumar K', mobile: '77080 71692', courseCode: 'UIUX' },
  { name: 'Mathavan S', mobile: '95664 14354', courseCode: 'UIUX' },
  { name: 'Balaji K C', mobile: '95141 62914', courseCode: 'UIUX' },
  { name: 'Ganesh K', mobile: '90872 66464', courseCode: 'UIUX' },
  { name: 'Boomika S', mobile: '99945 84449', courseCode: 'UIUX' },
  { name: 'CHEZLIYAN N L', mobile: '7010898554', courseCode: 'UIUX' },
  { name: 'SHYAM KUMAR A', mobile: '9344761399', courseCode: 'UIUX' },
  { name: 'ABISHEK K', mobile: '7604950103', courseCode: 'UIUX' },
  { name: 'ISHWARYA MOOGAMBIGA B', mobile: '9445538773', courseCode: 'UIUX' },

  // Video Editing
  { name: 'Kavitha M', mobile: '99940 83163', courseCode: 'VE' },
  { name: 'Banupriya M', mobile: '77083 63384', courseCode: 'VE' },
  { name: 'Sabarivasan M', mobile: '63744 78537', courseCode: 'VE' },
  { name: 'D RAJA', mobile: '8148817734', courseCode: 'VE' },
  { name: 'SIVAPRAKASH B', mobile: '9952657588', courseCode: 'VE' },
  { name: 'Gayathri M N', mobile: '9952604094', courseCode: 'VE' },
  { name: 'Elanchezhiyan', mobile: '8884476784', courseCode: 'VE' },
  { name: 'Atulaananth M', mobile: '8248410538', courseCode: 'DM' }
];

function cleanMobile(mobile) {
  return mobile.replace(/\s+/g, '').replace(/[^\d]/g, '');
}

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function addNewStudents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const results = { added: 0, skipped: 0, failed: 0 };
    const failedList = [];

    for (const [courseCode, { courseName, courseSlug, prefix }] of Object.entries(courseConfig)) {
      console.log(`\n📚 Processing ${courseName} (${courseSlug})...`);

      const courseStudents = rawStudents.filter(s => s.courseCode === courseCode);
      if (courseStudents.length === 0) continue;

      const existingStudents = await CourseStudent.find({ courseSlug });
      const existingNames = new Set(existingStudents.map(s => normalizeName(s.name)));
      const existingCertIds = new Set(existingStudents.map(s => s.certificateId));

      // Find the highest sequence number for this standard prefix
      let maxNum = 0;
      existingStudents.forEach(s => {
        if (s.certificateId && s.certificateId.startsWith(prefix)) {
          const match = s.certificateId.match(new RegExp(`${prefix}(\\d+)$`));
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });

      let nextNum = maxNum + 1;
      console.log(`   Next ${prefix} number: ${nextNum.toString().padStart(5, '0')}`);
      console.log(`   Students to add: ${courseStudents.length}\n`);

      for (const student of courseStudents) {
        const normalizedName = normalizeName(student.name);

        if (existingNames.has(normalizedName)) {
          console.log(`⏭️  Skipped (name exists): ${student.name}`);
          results.skipped++;
          continue;
        }

        const certificateId = `${prefix}${nextNum.toString().padStart(5, '0')}`;

        if (existingCertIds.has(certificateId)) {
          console.log(`⚠️  Cert ID collision, skipping: ${student.name} → ${certificateId}`);
          results.skipped++;
          nextNum++;
          continue;
        }

        try {
          const newStudent = new CourseStudent({
            name: student.name.trim(),
            courseName,
            courseSlug,
            certificateId,
            phoneNumber: cleanMobile(student.mobile),
            isEligible: true,
            certificateSent: false,
            dateOfRegistration: new Date()
          });

          await newStudent.save();
          console.log(`✅ Added: ${student.name} → ${certificateId}`);
          results.added++;
          existingNames.add(normalizedName);
          existingCertIds.add(certificateId);
          nextNum++;
        } catch (error) {
          if (error.code === 11000) {
            console.log(`⚠️  Skipped (duplicate key): ${student.name} → ${certificateId}`);
            results.skipped++;
          } else {
            console.error(`❌ Error adding ${student.name}: ${error.message}`);
            results.failed++;
            failedList.push({ name: student.name, certificateId, error: error.message });
          }
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Added: ${results.added}`);
    console.log(`⏭️  Skipped: ${results.skipped}`);
    console.log(`❌ Failed: ${results.failed}`);

    for (const { courseCode, courseName, courseSlug } of Object.values(courseConfig)) {
      const count = await CourseStudent.countDocuments({ courseSlug });
      console.log(`📈 ${courseName}: ${count} students`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (failedList.length > 0) {
      console.log('❌ Failed entries:');
      failedList.forEach(item => {
        console.log(`   - ${item.name} (${item.certificateId}): ${item.error}`);
      });
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

addNewStudents();
