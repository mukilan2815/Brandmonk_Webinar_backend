const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// Student phone numbers provided by admin (name, course label, phone)
// Replaces/updates phoneNumber on matching CourseStudent records only.
const studentPhones = [
  // --- Digital Marketing ---
  { name: 'Barath Kisore M', course: 'DM', phone: '90421 14374' },
  { name: 'Farzis Fathima M', course: 'DM', phone: '74183 96224' },
  { name: 'Franklin S', course: 'DM', phone: '99403 54302' },
  { name: 'Haripradeesh S', course: 'DM', phone: '98426 17943' },
  { name: 'Kamalchand M', course: 'DM', phone: '93455 40147' },
  { name: 'Karthikeyan S', course: 'DM', phone: '98407 43814' },
  { name: 'Lavanya S', course: 'DM', phone: '80738 25530' },
  { name: 'Mohamed Ashik A K', course: 'DM', phone: '63692 43310' },
  { name: 'Padmavathy C', course: 'DM', phone: '97890 40608' },
  { name: 'Samuel Solomon A', course: 'DM', phone: '98420 24028' },
  { name: 'Saranya M', course: 'DM', phone: '99440 36281' },
  { name: 'Shafran Ruby', course: 'DM', phone: '75388 12875' },
  { name: 'Shhown Cyril Dsouza', course: 'DM', phone: '82480 41507' },
  { name: 'Saraswathi', course: 'DM', phone: '9884651357' },
  { name: 'Abishek D', course: 'DM', phone: '73055 49142' },
  { name: 'Ashwin Kumar S', course: 'DM', phone: '91507 84466' },
  { name: 'Chippy B', course: 'DM', phone: '95661 61708' },
  { name: 'Hajira Hadi M', course: 'DM', phone: '97892 26661' },
  { name: 'JEEVA V', course: 'DM', phone: '95009 19771' },
  { name: 'Joni Janarthanan C', course: 'DM', phone: '93445 75897' },
  { name: 'G Khannaiah', course: 'DM', phone: '89397 48945' },
  { name: 'Karthick D', course: 'DM', phone: '93636 42305' },
  { name: 'Kavinsanjay M V', course: 'DM', phone: '90802 41708' },
  { name: 'Kiruthika S', course: 'DM', phone: '81482 23109' },
  { name: 'Kugunesh V', course: 'DM', phone: '87549 08185' },
  { name: 'Logesh Khanna M.A', course: 'DM', phone: '99945 66619' },
  { name: 'Mahalakshmi K', course: 'DM', phone: '87544 27596' },
  { name: 'Mariyappan E', course: 'DM', phone: '86678 93778' },
  { name: 'Masarif Ahamed', course: 'DM', phone: '89397 86077' },
  { name: 'N SARASWATHI', course: 'DM', phone: '98846 51357' },
  { name: 'Naveen S', course: 'DM', phone: '88258 30023' },
  { name: 'Nithish M', course: 'DM', phone: '88384 01908' },
  { name: 'Ranjith R', course: 'DM', phone: '63795 56386' },
  { name: 'Sankareswari E', course: 'DM', phone: '93423 61810' },
  { name: 'Saranraj M', course: 'DM', phone: '70108 36095' },
  { name: 'Yokesh G', course: 'DM', phone: '63827 55936' },
  { name: 'Kaleeswari', course: 'DM', phone: '96553 59099' },
  { name: 'Divakar', course: 'DM', phone: '93452 02753' },
  { name: 'Sai Rupa S', course: 'DM', phone: '63742 35191' },
  { name: 'Bala Murugavel M', course: 'DM', phone: '8870890682' },
  { name: 'ASHOKRAJ JAYABALU', course: 'DM', phone: '70107 67919' },
  { name: 'Gayathri J', course: 'DM', phone: '63828 45863' },
  { name: 'Gowsalya V', course: 'DM', phone: '89036 48306' },
  { name: 'Preethi (VALLIAMMAL G)', course: 'DM', phone: '63804 96267' },
  { name: 'Sandhiya Dharmaraj', course: 'DM', phone: '63853 56555' },
  { name: 'Jamurradhee Meenakshi', course: 'DM', phone: '6383734473' },
  { name: 'VASANTHAKUMARI SIVAKUMAR', course: 'DM', phone: '8778252060' },
  { name: 'Yuva Shankari S', course: 'DM', phone: '9361204536' },
  { name: 'GOKULAKRISHNAN K', course: 'DM', phone: '8668032799' },
  { name: 'Logeshwaran S', course: 'DM', phone: '8610511096' },
  { name: 'Praveen Raj V', course: 'DM', phone: '8148638205' },
  { name: 'Keerthana', course: 'DM', phone: '6380567671' },
  { name: 'Praveena T', course: 'DM', phone: '8072561052' },
  { name: 'ALBERT LEO', course: 'DM', phone: '9789827219' },
  { name: 'Gopika', course: 'DM', phone: '8939997284' },
  { name: 'Inidha', course: 'DM', phone: '8300310470' },
  { name: 'Gowtham', course: 'DM', phone: '7904702505' },
  { name: 'Eswar Sabari S', course: 'DM', phone: '9940067563' },
  { name: 'Thangakaruppu K', course: 'DM', phone: '8754244900' },
  { name: 'Ammar Ahamed H', course: 'DM', phone: '6369852197' },
  { name: 'Abinaya B', course: 'DM', phone: '9345327406' },
  { name: 'L AROCKIA RAJ', course: 'DM', phone: '9488057095' },
  { name: 'Reka T', course: 'DM', phone: '6381693004' },
  { name: 'G Khannaiah', course: 'DM', phone: '8939997497' },
  { name: 'Vivekanandan G', course: 'DM', phone: '9566433616' },
  { name: 'Miruna M', course: 'DM', phone: '9344384090' },
  { name: 'B Naga Prabhu', course: 'DM', phone: '7010267189' },
  { name: 'Gajalakshmi G', course: 'DM', phone: '8825714076' },
  { name: 'Nisha N', course: 'DM', phone: '9840250957' },
  { name: 'Devadharshini K', course: 'DM', phone: '8072603199' },
  { name: 'Mathews', course: 'DM', phone: '9361268055' },
  { name: 'Nirmal S', course: 'DM', phone: '9843545944' },
  { name: 'Sharuk Basha S', course: 'DM', phone: '8248807868' },
  { name: 'Magesh K', course: 'DM', phone: '7010899624' },

  // --- UI/UX ---
  { name: 'K VAISHALI', course: 'UIUX', phone: '95665 43118' },
  { name: 'Sri Renga Bala Krishnan V', course: 'UIUX', phone: '75388 07072' },
  { name: 'Sudhakaran M', course: 'UIUX', phone: '9600353375' },
  { name: 'Vasanthakumar M', course: 'UIUX', phone: '96295 94841' },
  { name: 'Vijaya Baskar', course: 'UIUX', phone: '7338900848' },
  { name: 'Cibesh G K', course: 'UIUX', phone: '93617 83577' },
  { name: 'Dharun P', course: 'UIUX', phone: '63806 57689' },
  { name: 'Gokulraj N', course: 'UIUX', phone: '89392 56463' },
  { name: 'Mohamed Rafeek', course: 'UIUX', phone: '70922 56976' },
  { name: 'Shanmathi P', course: 'UIUX', phone: '86106 77613' },
  { name: 'Vijay Nagarjun A B', course: 'UIUX', phone: '89257 15795' },
  { name: 'Naveena V', course: 'UIUX', phone: '93605 00293' },
  { name: 'Ajithkumar M', course: 'UIUX', phone: '9344007891' },
  { name: 'Kevin Kingsley C', course: 'UIUX', phone: '9600376718' },
  { name: 'Resma S', course: 'UIUX', phone: '9080993949' },
  { name: 'Naveena', course: 'UIUX', phone: '9360500293' },
  { name: 'Sabari A', course: 'UIUX', phone: '8270874230' },
  { name: 'Dharun P', course: 'UIUX', phone: '6380657689' },
  { name: 'Kamalanathan', course: 'UIUX', phone: '8098483235' },
  { name: 'Dheena T', course: 'UIUX', phone: '7418199206' },
  { name: 'Veronika S', course: 'UIUX', phone: '8825645259' },
  { name: 'Hanistan A', course: 'UIUX', phone: '9345001356' },
  { name: 'Arun V', course: 'UIUX', phone: '8825793889' },
  { name: 'Dineshkumar K', course: 'UIUX', phone: '7708071692' },

  // --- Video Editing ---
  { name: 'A B Antony Gutenburg', course: 'VE', phone: '97511 08691' },
  { name: 'Arun Prasath B', course: 'VE', phone: '82205 97705' },
  { name: 'Bharath S', course: 'VE', phone: '76391 15333' },
  { name: 'Euvaraj Subramani', course: 'VE', phone: '97401 78075' },
  { name: 'M JOHN DINESH', course: 'VE', phone: '78459 60961' },
  { name: 'Manikandan I', course: 'VE', phone: '99405 47561' },
  { name: 'OmPrakash S', course: 'VE', phone: '99417 97474' },
  { name: 'R N Charan Raj', course: 'VE', phone: '70131 69497' },
  { name: 'R SUGANTHI', course: 'VE', phone: '82486 76592' },
  { name: 'Rajesh P', course: 'VE', phone: '8807778061' },
  { name: 'Ramachandran P', course: 'VE', phone: '6282154478' },
  { name: 'RAMYA MURUGAN M', course: 'VE', phone: '8110927801' },
  { name: 'Vijay', course: 'VE', phone: '9843135069' },
  { name: 'Vinnarasi S', course: 'VE', phone: '8220081041' },
  { name: 'Anbukarasan M', course: 'VE', phone: '95002 69047' },
  { name: 'Ashaz Ahmed R', course: 'VE', phone: '73054 00484' },
  { name: 'Balaji R', course: 'VE', phone: '96554 84798' },
  { name: 'Jenibar M', course: 'VE', phone: '86789 12366' },
  { name: 'M Sham Kumar', course: 'VE', phone: '86828 95032' },
  { name: 'MOHAMMED AKHATHU', course: 'VE', phone: '72000 75753' },
  { name: 'Nijanthan Raj N', course: 'VE', phone: '93848 16625' },
  { name: 'Prabhuram A', course: 'VE', phone: '98944 06891' },
  { name: 'S Sakthipriya', course: 'VE', phone: '97902 04708' },
  { name: 'Saravanan V', course: 'VE', phone: '88254 44753' },
  { name: 'Thilagaraj S', course: 'VE', phone: '63842 41419' },
  { name: 'Vimalraj N', course: 'VE', phone: '93846 40800' },
  { name: 'Ramsingh', course: 'VE', phone: '7010109358' },
  { name: 'MOHAN DOSS', course: 'VE', phone: '87548 42160' },
  { name: 'Prasino', course: 'VE', phone: '93447 02944' },
  { name: 'PRIYADHARSHINI', course: 'VE', phone: '80569 48995' },
  { name: 'Suresh', course: 'VE', phone: '8248464807' },
  { name: 'Surya K', course: 'VE', phone: '9500732637' },
  { name: 'Sudha k', course: 'VE', phone: '6383798205' },
  { name: 'Monish', course: 'VE', phone: '9042842684' },
  { name: 'GOPINATH RAMANI', course: 'VE', phone: '9791061182' },
  { name: 'Sameeha A', course: 'VE', phone: '9345767926' },
  { name: 'Ithrees A', course: 'VE', phone: '9087857628' },
  { name: 'B Manikandan', course: 'VE', phone: '9840769722' },
  { name: 'Sanjay', course: 'VE', phone: '9514924665' },
  { name: 'Kamalakannan T', course: 'VE', phone: '8681830112' },
  { name: 'Padmanabhan S', course: 'VE', phone: '8508355920' },
  { name: 'Srinivas D', course: 'VE', phone: '8754802140' },
  { name: 'Udayaraj Kadri', course: 'VE', phone: '7483455753' },
  { name: 'Arul', course: 'VE', phone: '8618299015' },
  { name: 'PARTHIBAN S', course: 'VE', phone: '8248878813' },
  { name: 'Muthuraman S', course: 'VE', phone: '8667551762' },
  { name: 'Priyadharshini R', course: 'VE', phone: '9080479430' },
  { name: 'Hariharasudhan R', course: 'VE', phone: '6381624952' },
  { name: 'Harish Kumar S', course: 'VE', phone: '7418592105' },
  { name: 'Sambathraj D', course: 'VE', phone: '9500103872' },
  { name: 'NANDHAGOPAL K', course: 'VE', phone: '9361230477' },
  { name: 'DIVISH R S', course: 'VE', phone: '8300690210' },
  { name: 'Tamilarasi', course: 'VE', phone: '8144645227' },
  { name: 'Shangavi S M', course: 'VE', phone: '7373958208' },
  { name: 'Haridasan. G', course: 'VE', phone: '' },
  { name: 'Liyashini.G', course: 'VE', phone: '' },
  { name: 'B.Abinaya', course: 'VE', phone: '' },
  { name: 'Saravanan A', course: 'VE', phone: '7401589994' },
  { name: 'Kaviyarasu V', course: 'VE', phone: '9500263195' },
  { name: 'S MUTHURAMAN', course: 'VE', phone: '9944408259' },
  { name: 'Anbukarasan M', course: 'VE', phone: '9500269047' },
  { name: 'Sitheswar R', course: 'VE', phone: '8056429300' },
  { name: 'George Peter G', course: 'VE', phone: '7411756845' },
  { name: 'Syed Aaqib S N', course: 'VE', phone: '9940249846' },

  // --- Data Analytics ---
  { name: 'Anish Alex A', course: 'DA', phone: '80729 51708' },
  { name: 'S Vinoth Kumar', course: 'DA', phone: '76958 85938' },
  { name: 'Pranesh B', course: 'DA', phone: '90035 45196' },
  { name: 'R Poornima', course: 'DA', phone: '85239 28625' },
  { name: 'Arun G', course: 'DA', phone: '93606 19621' },

  // --- Artificial Intelligence ---
  { name: 'Ramesh', course: 'AI', phone: '9943059921' },
  { name: 'Manjula', course: 'AI', phone: '9884551223' }
];

const COURSE_SLUG_MAP = {
  'DM': 'digital-marketing',
  'Digital Marketing': 'digital-marketing',
  'DM - FEB': 'digital-marketing',
  'UIUX': 'ui-ux',
  'UI/UX Design': 'ui-ux',
  'OCT - UIUX': 'ui-ux',
  'VE': 'video-editing',
  'Video Editing': 'video-editing',
  'VE - DEC': 'video-editing',
  'VE - JAN': 'video-editing',
  'April - ve': 'video-editing',
  'DA': 'data-analytics',
  'AI': 'artificial-intelligence'
};

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

function cleanPhone(phone) {
  return (phone || '').replace(/\D/g, '');
}

async function updatePhones() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    let notFound = 0;
    let skipped = 0;
    const notFoundList = [];

    for (const entry of studentPhones) {
      const slug = COURSE_SLUG_MAP[entry.course];
      const phone = cleanPhone(entry.phone);

      if (!slug) {
        console.log(`⚠️  Unknown course label: ${entry.course} (${entry.name})`);
        skipped++;
        continue;
      }

      const normalizedName = normalizeName(entry.name);
      const students = await CourseStudent.find({ courseSlug: slug });

      const match = students.find(s => normalizeName(s.name) === normalizedName);

      if (!match) {
        console.log(`❌ NOT FOUND: ${entry.name} (${entry.course})`);
        notFound++;
        notFoundList.push(`${entry.name} (${entry.course})`);
        continue;
      }

      if (!phone) {
        console.log(`⏭️  In DB but no phone provided: ${entry.name} (${entry.course}) [${match.certificateId}]`);
        skipped++;
        continue;
      }

      match.phoneNumber = phone;
      await match.save();
      console.log(`✅ Updated: ${entry.name} (${entry.course}) → ${phone} [${match.certificateId}]`);
      updated++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Not found: ${notFound}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    if (notFoundList.length > 0) {
      console.log('\n❌ Not found list:');
      notFoundList.forEach(name => console.log(`   - ${name}`));
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

updatePhones();
