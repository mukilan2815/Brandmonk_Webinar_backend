const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_SLUG = 'video-editing';

const phoneData = [
  { name: 'R N Charan Raj', mobile: '7013169497' },
  { name: 'Anish Kumar J', mobile: '8220718262' },
  { name: 'MELWINREX SOLOMON', mobile: '9787700822' },
  { name: 'Indira', mobile: '9345235377' },
  { name: 'S Kumar', mobile: '9384515503' },
  { name: 'Satheesh kumar', mobile: '9419017965' },
  { name: 'RAJA MOHAMED B', mobile: '8248387438' },
  { name: 'Dhaneesh G', mobile: '8825425529' },
  { name: 'Anutha V', mobile: '9360163204' },
  { name: 'RAMYA MURUGAN M', mobile: '8110927801' },
  { name: 'Maari', mobile: '7358707975' },
  { name: 'M DINESH', mobile: '7845960961' },
  { name: 'Sangeethkumar S', mobile: '7448698867' },
  { name: 'MUNIRAJ T', mobile: '9942285750' },
  { name: 'Dineshkumar R', mobile: '9360637508' },
  { name: 'MOHAMMED AKHATHU', mobile: '7200075753' },
  { name: 'OmPrakash S', mobile: '9941797474' },
  { name: 'Jubinesh', mobile: '8903929622' },
  { name: 'Ganavel P', mobile: '9952625292' },
  { name: 'George G', mobile: '7411756845' },
  { name: 'MANIVANNAN M', mobile: '9677562445' },
  { name: 'Senthil Kumar', mobile: '9789325159' },
  { name: 'VASANTHAN K', mobile: '9944994532' },
  { name: 'ROHITH SABAPANI', mobile: '9952200154' },
  { name: 'Anitha Vignesh', mobile: '9150112791' },
  { name: 'Asmitha Vaishnavi S', mobile: '9025485771' },
  { name: 'Boobalan R', mobile: '7708449333' },
  { name: 'MOHAMMED SAZSA', mobile: '6382316916' },
  { name: 'VELMURUGAN S', mobile: '9342672515' },
  { name: 'SHARMILA R', mobile: '9791458992' },
  { name: 'Arun Prasath B', mobile: '8220597705' },
  { name: 'Vijay', mobile: '9843135069' },
  { name: 'Suresh', mobile: '8248464807' },
  { name: 'VELU JAYASEELAN', mobile: '9003455352' },
  { name: 'Tamil', mobile: '9789639415' },
  { name: 'Noorul Afiya H', mobile: '6380053977' },
  { name: 'Gowtham Nirmal', mobile: '9710730873' },
  { name: 'Arvind Kumar P', mobile: '8903264391' },
  { name: 'Jai', mobile: '9884573988' },
  { name: 'Supriya', mobile: '9597593973' },
  { name: 'Prasino', mobile: '9344702944' },
  { name: 'Satheesh', mobile: '9487103983' },
  { name: 'S Sakthipriya', mobile: '9790204708' },
  { name: 'Ragavi', mobile: '9444162378' },
  { name: 'Gomathy D', mobile: '8925419045' },
  { name: 'SANJAI K', mobile: '9677315849' },
  { name: 'Manoj', mobile: '8248634069' },
  { name: 'R KANCHANADEVI', mobile: '9600851106' },
  { name: 'Upendra C', mobile: '7760100596' },
  { name: 'Prem Kumar', mobile: '7339369061' },
  { name: 'Devendran', mobile: '9585323119' },
  { name: 'Rajesh P', mobile: '8807778061' },
  { name: 'Devadharsini', mobile: '7418810129' },
  { name: 'Gokul S', mobile: '8610141721' },
  { name: 'Surya K', mobile: '9500732637' },
  { name: 'Kaleeswari', mobile: '9487053514' },
  { name: 'Santhosh', mobile: '9952929675' },
  { name: 'Vijaya Ananth VS', mobile: '8074381281' },
  { name: 'R K Ramanan', mobile: '9363999599' },
  { name: 'Ramsingh', mobile: '7010109358' },
  { name: 'Parameswaran Selvakumar', mobile: '6383148771' },
  { name: 'Kiran Karthick', mobile: '7868851889' },
  { name: 'Farzis Fathima M', mobile: '7418396224' },
  { name: 'SHANGAVI T', mobile: '7373958208' },
  { name: 'Santhiya Raj', mobile: '8681879208' },
  { name: 'Nirmalraj Gunasekar', mobile: '9585989422' },
  { name: 'VEENA SELVAN', mobile: '9688373346' },
  { name: 'varalakshmi', mobile: '9578438630' },
  { name: 'RIYAZUNNISA JAINULABUDEEN', mobile: '6369635917' },
  { name: 'sameen Afrose M', mobile: '9043770832' },
  { name: 'Kavinraj', mobile: '7708489942' },
  { name: 'MOHAN DOSS', mobile: '8754842160' },
  { name: 'Kiran Kumar', mobile: '7013900546' },
  { name: 'MARIA M', mobile: '9943930065' },
  { name: 'Vighash', mobile: '9385367611' },
  { name: 'Nijanthan Raj N', mobile: '9384816625' },
  { name: 'manikandan', mobile: '9940547561' },
  { name: 'Kanniraj P', mobile: '8838531758' },
  { name: 'Kavitha', mobile: '7708589674' },
  { name: 'Saraswathi', mobile: '9884651357' },
  { name: 'Chandrasekhar E', mobile: '7416444692' },
  { name: 'CHODA SUSHMA', mobile: '7981181532' },
  { name: 'Santhosh S', mobile: '8072235762' },
  { name: 'Iswarya Ramadoss', mobile: '8778146676' },
  { name: 'Jayasree Sridhar', mobile: '7010451337' },
  { name: 'Serose', mobile: '9487690840' },
  { name: 'Abinaya B', mobile: '6369307973' },
  { name: 'Nandhini Vellaisamy', mobile: '7010911196' },
  { name: 'Bharath S', mobile: '7639115333' },
  { name: 'Prabhakaran K', mobile: '9500838386' },
  { name: 'AKSHAYA V', mobile: '9025639120' },
  { name: 'Ramachandran P', mobile: '6282154478' },
  { name: 'M PRAVEEN', mobile: '6383439602' },
  { name: 'Chevvanthi', mobile: '9003621110' },
  { name: 'Neela G', mobile: '9342546656' },
  { name: 'Kanchanadevi', mobile: '6382000350' },
  { name: 'Vignesh K', mobile: '8072334921' },
  { name: 'Nizad U', mobile: '9363875114' },
  { name: 'Sanjay Selvam', mobile: '9500541930' },
  { name: 'Vivekanand P', mobile: '9360268737' },
  { name: 'Ekramullah', mobile: '6379689719' },
  { name: 'Sakthivel N', mobile: '9942306908' },
  { name: 'James paulraj', mobile: '8287650988' },
  { name: 'Syed Aashik', mobile: '8610102766' },
  { name: 'PARTHIBAN S', mobile: '8248878813' },
  { name: 'Muthu Raman', mobile: '8667551762' },
  { name: 'sana', mobile: '7339336276' },
  { name: 'Euvaraj Subramani', mobile: '9740178075' },
  { name: 'Balakrishnan Appanasamy', mobile: '9345571614' },
  { name: 'Padmanabhan S', mobile: '8508355920' },
  { name: 'Arulprakash P', mobile: '8675053245' },
  { name: 'Srinivas D', mobile: '8754802140' },
  { name: 'A B Antony Gutenburg', mobile: '9751108691' },
  { name: 'PRIYADHARSHINI', mobile: '8056948995' },
  { name: 'Kamalakannan', mobile: '8681830112' },
  { name: 'Rajesh', mobile: '9121848375' },
  { name: 'Gowtham S', mobile: '9110812337' },
  { name: 'Vinnarasi S', mobile: '8220081041' },
  { name: 'Dineshkumar R', mobile: '9655227740' },
  { name: 'Dharshan Babu B', mobile: '9123531511' },
  { name: 'Komathi', mobile: '9566023085' },
  { name: 'Monish', mobile: '9042842684' },
  { name: 'Santhiya Sahayaraj', mobile: '8270174957' },
  { name: 'Azahagendiran S', mobile: '9047858944' },
  { name: 'Prabhu M', mobile: '9894524221' },
  { name: 'Santhosh', mobile: '9092785005' },
  { name: 'Vivek', mobile: '9600751125' },
  { name: 'R SUGANTHI', mobile: '8248676592' },
  { name: 'Balasubramanian E', mobile: '8919933461' },
  { name: 'Iswarya', mobile: '9677395191' },
  { name: 'KRISHNAVENI SELVAN', mobile: '7538891818' },
  { name: 'SANGEETHA V', mobile: '8248266274' },
  { name: 'Kaleeswari', mobile: '9952909819' }
];

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

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
