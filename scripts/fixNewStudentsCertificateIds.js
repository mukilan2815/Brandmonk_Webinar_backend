const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const newStudents = [
  // Digital Marketing
  { name: 'Nirmal Raj', mobile: '9585989422', courseSlug: 'digital-marketing' },
  { name: 'Harish M R', mobile: '63813 80338', courseSlug: 'digital-marketing' },
  { name: 'Naveen Vinayak S', mobile: '80722 00478', courseSlug: 'digital-marketing' },
  { name: 'Lakshmi Durgaa M', mobile: '82208 07063', courseSlug: 'digital-marketing' },
  { name: 'Abuthahir J', mobile: '99414 14311', courseSlug: 'digital-marketing' },
  { name: 'Gayathri V', mobile: '63811 77980', courseSlug: 'digital-marketing' },
  { name: 'SANDHIYA S', mobile: '7339156662', courseSlug: 'digital-marketing' },
  { name: 'ABINAYA M', mobile: '6384770177', courseSlug: 'digital-marketing' },
  { name: 'DHAYANANDHAN V', mobile: '9629188627', courseSlug: 'digital-marketing' },
  { name: 'NAVEENKUMAR M', mobile: '9445883101', courseSlug: 'digital-marketing' },
  { name: 'Atulaananth M', mobile: '8248410538', courseSlug: 'digital-marketing' },

  // UI/UX
  { name: 'Dinesh Kumar K', mobile: '77080 71692', courseSlug: 'ui-ux' },
  { name: 'Mathavan S', mobile: '95664 14354', courseSlug: 'ui-ux' },
  { name: 'Balaji K C', mobile: '95141 62914', courseSlug: 'ui-ux' },
  { name: 'Ganesh K', mobile: '90872 66464', courseSlug: 'ui-ux' },
  { name: 'Boomika S', mobile: '99945 84449', courseSlug: 'ui-ux' },
  { name: 'CHEZLIYAN N L', mobile: '7010898554', courseSlug: 'ui-ux' },
  { name: 'SHYAM KUMAR A', mobile: '9344761399', courseSlug: 'ui-ux' },
  { name: 'ABISHEK K', mobile: '7604950103', courseSlug: 'ui-ux' },
  { name: 'ISHWARYA MOOGAMBIGA B', mobile: '9445538773', courseSlug: 'ui-ux' },

  // Video Editing
  { name: 'Kavitha M', mobile: '99940 83163', courseSlug: 'video-editing' },
  { name: 'Banupriya M', mobile: '77083 63384', courseSlug: 'video-editing' },
  { name: 'Sabarivasan M', mobile: '63744 78537', courseSlug: 'video-editing' },
  { name: 'D RAJA', mobile: '8148817734', courseSlug: 'video-editing' },
  { name: 'SIVAPRAKASH B', mobile: '9952657588', courseSlug: 'video-editing' },
  { name: 'Gayathri M N', mobile: '9952604094', courseSlug: 'video-editing' },
  { name: 'Elanchezhiyan', mobile: '8884476784', courseSlug: 'video-editing' }
];

function cleanMobile(mobile) {
  return String(mobile).replace(/\s+/g, '').replace(/[^\d]/g, '');
}

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Define the batch format to continue for each course
    const batchFormats = {
      'digital-marketing': 'BMAJUNDMMES/Q0506S',
      'ui-ux': 'BMAJUNUIMES/Q0306S',
      'video-editing': 'BMAJUNVEMES/Q1401S'
    };

    // Find max sequence for each batch format
    const maxByFormat = {};
    for (const [courseSlug, prefix] of Object.entries(batchFormats)) {
      const students = await CourseStudent.find({ courseSlug });
      let maxNum = 0;
      students.forEach(s => {
        if (s.certificateId && s.certificateId.startsWith(prefix)) {
          const match = s.certificateId.match(new RegExp(`${prefix}(\\d+)$`));
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
      maxByFormat[courseSlug] = maxNum;
      console.log(`${courseSlug}: max existing ${prefix} number = ${maxNum}`);
    }

    // Group new students by course
    const byCourse = {};
    for (const s of newStudents) {
      if (!byCourse[s.courseSlug]) byCourse[s.courseSlug] = [];
      byCourse[s.courseSlug].push(s);
    }

    const updates = [];
    for (const [courseSlug, students] of Object.entries(byCourse)) {
      const prefix = batchFormats[courseSlug];
      let nextNum = maxByFormat[courseSlug] + 1;

      for (const s of students) {
        const normalizedName = normalizeName(s.name);
        const target = await CourseStudent.findOne({
          courseSlug,
          $or: [
            { name: { $regex: new RegExp(`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
            { phoneNumber: cleanMobile(s.mobile) }
          ]
        });

        if (!target) {
          console.log(`❌ Not found: ${s.name} (${courseSlug})`);
          continue;
        }

        const newId = `${prefix}${nextNum.toString().padStart(3, '0')}`;
        const oldId = target.certificateId;
        console.log(`📝 ${target.name} (${courseSlug}): ${oldId} → ${newId}`);
        target.certificateId = newId;
        await target.save();
        updates.push({ name: target.name, courseSlug, oldId, newId });
        nextNum++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated ${updates.length} certificate IDs`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

main();
