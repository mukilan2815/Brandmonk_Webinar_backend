const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_SLUG = 'ui-ux';

const phoneData = [
  { name: 'Cabrio', mobile: '9025910261' },
  { name: 'Lakshmanan', mobile: '9345490092' },
  { name: 'Mahalakshmi N', mobile: '8072031839' },
  { name: 'Sneha T', mobile: '8778360103' },
  { name: 'Maha Swetha T', mobile: '9487183246' },
  { name: 'Hanisha', mobile: '9488288449' },
  { name: 'Gowtham', mobile: '9361585284' },
  { name: 'Vishnu P', mobile: '7639626945' },
  { name: 'Manoj G', mobile: '9361615398' },
  { name: 'S VISHNUDURGA', mobile: '9360605797' },
  { name: 'Pavithran', mobile: '9207064945' },
  { name: 'KANIMOZHI K', mobile: '9600446871' },
  { name: 'kamalanathan', mobile: '8098483235' },
  { name: 'Abirami', mobile: '9597506194' },
  { name: 'Arunkumar Shanmugam', mobile: '9786874318' },
  { name: 'DURGA M', mobile: '8300815895' },
  { name: 'KALAI VANI', mobile: '8523938975' },
  { name: 'Reshma', mobile: '9080993949' },
  { name: 'Hanistan', mobile: '9345001356' },
  { name: 'Shobika', mobile: '8056063226' },
  { name: 'Dheena', mobile: '7418199206' },
  { name: 'Rupesh Radhev R', mobile: '9345137781' },
  { name: 'Sabari', mobile: '8270874230' },
  { name: 'vasanth', mobile: '8925326285' },
  { name: 'sudhakaran', mobile: '9600353375' },
  { name: 'Vivek P', mobile: '9080311933' },
  { name: 'K VAISHALI', mobile: '9566543118' },
  { name: 'SARANYA CHINNATHAMBI', mobile: '6382385578' },
  { name: 'JAGANATH D', mobile: '7418239553' },
  { name: 'Vedhasri Rajamanickam', mobile: '9025898642' },
  { name: 'SUJITHA SHANMUGAM', mobile: '9500414873' },
  { name: 'Arun', mobile: '8825793889' },
  { name: 'S SARMILA', mobile: '6380470715' },
  { name: 'Ajithkumar M', mobile: '9344007891' },
  { name: 'CHRISWIN D GESILDEV', mobile: '8220513500' },
  { name: 'Dhinesh', mobile: '8220949014' },
  { name: 'Gayathiri C', mobile: '9842222778' },
  { name: 'Dheena', mobile: '9566365468' },
  { name: 'Dinesh Raj', mobile: '7397562305' },
  { name: 'Vignesh', mobile: '8807735113' },
  { name: 'VIJAYA B', mobile: '7338900848' },
  { name: 'SHIVAPRIYAA S', mobile: '8148806107' },
  { name: 'Palaniyammal', mobile: '6382416007' },
  { name: 'Deepa sri', mobile: '8825856517' },
  { name: 'Askhaya', mobile: '9342253830' },
  { name: 'Kamalakannan', mobile: '8778051008' },
  { name: 'Varshaan', mobile: '9487744601' },
  { name: 'Praiselin N', mobile: '9486287812' },
  { name: 'Aarthi', mobile: '9952629981' },
  { name: 'Monica G', mobile: '8610135641' },
  { name: 'Vijayakumar V', mobile: '8618296747' },
  { name: 'Malaviga R', mobile: '8072859843' },
  { name: 'Santhakumar S', mobile: '6374094931' },
  { name: 'S Aravinth Kumar', mobile: '6383495906' },
  { name: 'Ganesh Kumar', mobile: '8940667088' },
  { name: 'Mohamed Jaffar', mobile: '9944081597' },
  { name: 'Srirengabalakrishnan V', mobile: '7538807072' },
  { name: 'Vijay Nagarjun A B', mobile: '8925715795' },
  { name: 'Gokulnath', mobile: '9500259581' },
  { name: 'Dinesh Manimuthu', mobile: '6379185018' },
  { name: 'Vasanthakumar M', mobile: '9629594841' },
  { name: 'Ritheesh M', mobile: '8220258485' },
  { name: 'Sathish Kumar A', mobile: '9655212464' },
  { name: 'Kopperundevi N', mobile: '7397506495' },
  { name: 'Naveena Venkat', mobile: '9360500293' },
  { name: 'Daniel G', mobile: '7806887470' },
  { name: 'Kishore S', mobile: '8667224118' },
  { name: 'Sugavanam R', mobile: '9677970446' },
  { name: 'Sarulatha G', mobile: '9342363921' },
  { name: 'Kanishkar J N', mobile: '9952269877' },
  { name: 'SARUMATHI R', mobile: '6381568278' },
  { name: 'Shanmathi P', mobile: '8610677613' },
  { name: 'Sharmila T', mobile: '8825513257' }
];

async function updatePhoneNumbers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    let notFound = 0;

    for (const item of phoneData) {
      const cleanMobile = item.mobile.replace(/\D/g, '');

      const student = await CourseStudent.findOne({
        courseSlug: COURSE_SLUG,
        name: { $regex: new RegExp('^' + item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
      });

      if (student) {
        student.phoneNumber = cleanMobile;
        await student.save();
        console.log(`✅ Updated: ${student.name} → ${cleanMobile}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${item.name}`);
        notFound++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Not found: ${notFound}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

updatePhoneNumbers();
