const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_NAME = 'Advanced Video Editing (AI-Integrated)';
const COURSE_SLUG = 'video-editing';

const veStudents = [
  { name: 'R N Charan Raj' },
  { name: 'Anish Kumar J' },
  { name: 'MELWINREX SOLOMON' },
  { name: 'Indira' },
  { name: 'S Kumar' },
  { name: 'Satheesh kumar' },
  { name: 'RAJA MOHAMED B' },
  { name: 'Dhaneesh G' },
  { name: 'Anutha V' },
  { name: 'RAMYA MURUGAN M' },
  { name: 'Maari' },
  { name: 'M DINESH' },
  { name: 'Sangeethkumar S' },
  { name: 'MUNIRAJ T' },
  { name: 'Dineshkumar R' },
  { name: 'MOHAMMED AKHATHU' },
  { name: 'OmPrakash S' },
  { name: 'Jubinesh' },
  { name: 'Ganavel P' },
  { name: 'George G' },
  { name: 'MANIVANNAN M' },
  { name: 'Senthil Kumar' },
  { name: 'VASANTHAN K' },
  { name: 'ROHITH SABAPANI' },
  { name: 'Anitha Vignesh' },
  { name: 'Asmitha Vaishnavi S' },
  { name: 'Boobalan R' },
  { name: 'MOHAMMED SAZSA' },
  { name: 'VELMURUGAN S' },
  { name: 'SHARMILA R' },
  { name: 'Arun Prasath B' },
  { name: 'Vijay' },
  { name: 'Suresh' },
  { name: 'VELU JAYASEELAN' },
  { name: 'Tamil' },
  { name: 'Noorul Afiya H' },
  { name: 'Gowtham Nirmal' },
  { name: 'Arvind Kumar P' },
  { name: 'Jai' },
  { name: 'Supriya' },
  { name: 'Prasino' },
  { name: 'Satheesh' },
  { name: 'S Sakthipriya' },
  { name: 'Ragavi' },
  { name: 'Gomathy D' },
  { name: 'SANJAI K' },
  { name: 'Manoj' },
  { name: 'R KANCHANADEVI' },
  { name: 'Upendra C' },
  { name: 'Prem Kumar' },
  { name: 'Devendran' },
  { name: 'Rajesh P' },
  { name: 'Devadharsini' },
  { name: 'Gokul S' },
  { name: 'Surya K' },
  { name: 'Kaleeswari' },
  { name: 'Santhosh PM' },
  { name: 'Vijaya Ananth VS' },
  { name: 'R K Ramanan' },
  { name: 'Ramsingh' },
  { name: 'Parameswaran Selvakumar' },
  { name: 'Kiran Karthick' },
  { name: 'Farzis Fathima M' },
  { name: 'SHANGAVI T' },
  { name: 'Santhiya Raj' },
  { name: 'Nirmalraj Gunasekar' },
  { name: 'VEENA SELVAN' },
  { name: 'varalakshmi' },
  { name: 'RIYAZUNNISA JAINULABUDEEN' },
  { name: 'sameen Afrose M' },
  { name: 'Kavinraj' },
  { name: 'MOHAN DOSS' },
  { name: 'Kiran Kumar' },
  { name: 'MARIA M' },
  { name: 'Vighash' },
  { name: 'Nijanthan Raj N' },
  { name: 'manikandan' },
  { name: 'Kanniraj P' },
  { name: 'Kavitha' },
  { name: 'Saraswathi' },
  { name: 'Chandrasekhar E' },
  { name: 'CHODA SUSHMA' },
  { name: 'Santhosh S' },
  { name: 'Iswarya Ramadoss' },
  { name: 'Jayasree Sridhar' },
  { name: 'Serose' },
  { name: 'Abinaya B' },
  { name: 'Nandhini Vellaisamy' },
  { name: 'Bharath S' },
  { name: 'Prabhakaran K' },
  { name: 'AKSHAYA V' },
  { name: 'Ramachandran P' },
  { name: 'M PRAVEEN' },
  { name: 'Chevvanthi' },
  { name: 'Neela G' },
  { name: 'Kanchanadevi' },
  { name: 'Vignesh K' },
  { name: 'Nizad U' },
  { name: 'Sanjay Selvam' },
  { name: 'Vivekanand P' },
  { name: 'Ekramullah' },
  { name: 'Sakthivel N' },
  { name: 'James paulraj' },
  { name: 'Syed Aashik' },
  { name: 'PARTHIBAN S' },
  { name: 'Muthu Raman' },
  { name: 'sana' },
  { name: 'Euvaraj Subramani' },
  { name: 'Balakrishnan Appanasamy' },
  { name: 'Padmanabhan S' },
  { name: 'Arulprakash P' },
  { name: 'Srinivas D' },
  { name: 'A B Antony Gutenburg' },
  { name: 'PRIYADHARSHINI' },
  { name: 'Kamalakannan' },
  { name: 'Rajesh' },
  { name: 'Gowtham S' },
  { name: 'Vinnarasi S' },
  { name: 'Dineshkumar R' },
  { name: 'Dharshan Babu B' },
  { name: 'Komathi' },
  { name: 'Monish' },
  { name: 'Santhiya Sahayaraj' },
  { name: 'Azahagendiran S' },
  { name: 'Prabhu M' },
  { name: 'Santhosh' },
  { name: 'Vivek' },
  { name: 'R SUGANTHI' },
  { name: 'Balasubramanian E' },
  { name: 'Iswarya' },
  { name: 'KRISHNAVENI SELVAN' },
  { name: 'SANGEETHA V' },
  { name: 'Kaleeswari' }
];

async function resetStudents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const deleteResult = await CourseStudent.deleteMany({ courseSlug: COURSE_SLUG });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing Video Editing students\n`);

    const docs = veStudents.map((s, index) => ({
      name: s.name,
      courseName: COURSE_NAME,
      courseSlug: COURSE_SLUG,
      certificateId: `BMAJUNVEMES/Q1401S${(index + 1).toString().padStart(3, '0')}`,
      isEligible: true,
      certificateSent: false,
      dateOfRegistration: new Date()
    }));

    await CourseStudent.insertMany(docs);
    console.log(`✅ Added ${docs.length} Video Editing students\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🗑️  Deleted: ${deleteResult.deletedCount}`);
    console.log(`✅ Added: ${docs.length}`);
    console.log(`📈 Total VE students: ${docs.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

resetStudents();
