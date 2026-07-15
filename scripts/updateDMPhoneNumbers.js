const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

const COURSE_SLUG = 'digital-marketing';

const phoneData = [
  { name: 'Saranraj M', mobile: '7010836095' },
  { name: 'Balaji L', mobile: '9551652752' },
  { name: 'George', mobile: '9363123135' },
  { name: 'Faisal Rahuman J', mobile: '6380934284' },
  { name: 'Samundeeswari P', mobile: '9677672941' },
  { name: 'Lavanya', mobile: '8220158794' },
  { name: 'Sandhiya Dharmaraj', mobile: '6385356555' },
  { name: 'Madhusoothanan V', mobile: '9600900022' },
  { name: 'Praveen Kumar', mobile: '8940862239' },
  { name: 'Thaitamil', mobile: '9047820900' },
  { name: 'Ganesh kangaraj', mobile: '9944114884' },
  { name: 'Dharanidharan P', mobile: '9080624911' },
  { name: 'Shruthi C M', mobile: '8122967890' },
  { name: 'Vanumamalai Perumal M', mobile: '8300237955' },
  { name: 'Divya R', mobile: '7548846061' },
  { name: 'Surya B', mobile: '8438974582' },
  { name: 'DANIEL S', mobile: '7538823849' },
  { name: 'Sangeetha R', mobile: '9600719435' },
  { name: 'Vijaya harshini', mobile: '9952619197' },
  { name: 'Muthukumar G', mobile: '9841781675' },
  { name: 'Mohamed Ashik A K', mobile: '6369243310' },
  { name: 'SAVITHIRI C', mobile: '9626562790' },
  { name: 'Mahesh R', mobile: '8778249132' },
  { name: 'ARCHANA G', mobile: '6380530149' },
  { name: 'Preethi (amma VALLIAMMAL G)', mobile: '6380496267' },
  { name: 'Haripradeesh S', mobile: '9842617943' },
  { name: 'Karthikeyan S', mobile: '9840743814' },
  { name: 'GIRIJA R', mobile: '9790624193' },
  { name: 'Deepan S', mobile: '6382384481' },
  { name: 'Manjuladevi S', mobile: '9597086306' },
  { name: 'Barath Kisore M', mobile: '9042114374' },
  { name: 'Saranya M', mobile: '9944036281' },
  { name: 'Brindha Ayyappan', mobile: '7558125780' },
  { name: 'Mari selvi', mobile: '9894522604' },
  { name: 'Salathiya A', mobile: '6374448916' },
  { name: 'Uma R', mobile: '9940095785' },
  { name: 'Kiran Raj P R', mobile: '7708874725' },
  { name: 'Moganasundaram V', mobile: '9943033884' },
  { name: 'Safrin Nihara A', mobile: '8270355115' },
  { name: 'Sripriya J', mobile: '9742338173' },
  { name: 'Saravanan R', mobile: '8248062968' },
  { name: 'Nithish M', mobile: '8838401908' },
  { name: 'Azif Alikhan S', mobile: '7010710842' },
  { name: 'Lavanya S', mobile: '8073825530' },
  { name: 'Pavithra G', mobile: '9500908464' },
  { name: 'Saravanan G', mobile: '9629871918' },
  { name: 'AROCKIARAJ SAMY', mobile: '9488057095' },
  { name: 'Dhayanandhan V', mobile: '9080425098' },
  { name: 'Shyam Arumugam', mobile: '9600780815' },
  { name: 'Narmathan R', mobile: '6382689924' },
  { name: 'Sivasaravanan K', mobile: '9791429685' },
  { name: 'AMARNATH D', mobile: '8190960895' },
  { name: 'RAMAPRABHA V', mobile: '9360887819' },
  { name: 'guru', mobile: '9092687691' },
  { name: 'Premnath K', mobile: '6383014769' },
  { name: 'Subramani M', mobile: '9342676402' },
  { name: 'Aasefa', mobile: '9025136410' },
  { name: 'Sakthi Vigneswari M', mobile: '8098191618' },
  { name: 'SAVINKUMAR K', mobile: '9384215163' },
  { name: 'Uthirakumar G', mobile: '9943424343' },
  { name: 'kaviya', mobile: '9944924060' },
  { name: 'Samuel Solomon A', mobile: '9842024028' },
  { name: 'Ranjith R', mobile: '6379556386' },
  { name: 'Sowmiya M', mobile: '9994471380' },
  { name: 'Devadharshini', mobile: '8072603199' },
  { name: 'Naveen S', mobile: '8825830023' },
  { name: 'Alphonse V', mobile: '7010214971' },
  { name: 'Shhown Cyril Dsouza', mobile: '8248041507' },
  { name: 'Harshavarthan J', mobile: '9345495459' },
  { name: 'Kavitha G', mobile: '8870831813' },
  { name: 'Pragathiswaran S', mobile: '9686478480' },
  { name: 'Shafran Ruby', mobile: '7538812875' },
  { name: 'Mathsur', mobile: '9361268055' },
  { name: 'Ramkumar Bawa', mobile: '8080232648' },
  { name: 'Sabitha Murugesan', mobile: '7904592973' },
  { name: 'Raguwaran R', mobile: '9629426541' },
  { name: 'Gowsalya V', mobile: '8903648306' },
  { name: 'Nishali Sivakumar', mobile: '7358850154' },
  { name: 'Sankareswari E', mobile: '9342361810' },
  { name: 'Gayathri J', mobile: '6382845863' },
  { name: 'S SAJINI', mobile: '9952907563' },
  { name: 'Dhanusigasree R', mobile: '9043961380' },
  { name: 'Vinothkumar M', mobile: '8525813464' },
  { name: 'Govindaraj Rajagopal', mobile: '8300247583' },
  { name: 'Nageshwari M', mobile: '8220933679' },
  { name: 'Balaji S', mobile: '9789471572' },
  { name: 'Reka THARMAR', mobile: '6381693004' },
  { name: 'Nivasini Jayakumar', mobile: '6382456075' },
  { name: 'Sowndharya S', mobile: '8608715799' },
  { name: 'akshay', mobile: '8122323479' },
  { name: 'Mahalakshmi K', mobile: '8754427596' },
  { name: 'Mohan', mobile: '7708389046' },
  { name: 'Abirami J S', mobile: '9345523762' },
  { name: 'ARJUNAN A', mobile: '9965510490' },
  { name: 'Karthini J B', mobile: '9363280655' },
  { name: 'Balaji B', mobile: '9150260787' },
  { name: 'Mohan Ganesan', mobile: '9363547195' },
  { name: 'Karthick D', mobile: '9363642305' },
  { name: 'Sherin S', mobile: '9994028777' },
  { name: 'Safrin Begum M', mobile: '9500928477' },
  { name: 'Manimala K', mobile: '8098623234' },
  { name: 'Kather Batcha J', mobile: '9087555841' },
  { name: 'Maria', mobile: '9994898665' },
  { name: 'Gajalakshmi G', mobile: '8825714076' },
  { name: 'Gayathri', mobile: '9940167357' },
  { name: 'Mayajothi K', mobile: '9840323119' },
  { name: 'Gokila P', mobile: '8870480956' },
  { name: 'Abdul Latheef', mobile: '9384262097' },
  { name: 'Ashwin Kumar S', mobile: '9150784466' },
  { name: 'Sabarigirivasan V', mobile: '9080466158' },
  { name: 'Boopathy C', mobile: '8925201576' },
  { name: 'Karthick P', mobile: '9842635964' },
  { name: 'Vikram R', mobile: '6380120064' },
  { name: 'Vanmathi', mobile: '8056294529' },
  { name: 'Padmavathy C', mobile: '9789040608' },
  { name: 'Yokesh G', mobile: '6382755936' },
  { name: 'Sakthika R', mobile: '9344040140' },
  { name: 'Chitra Ramamurthi', mobile: '8940564462' },
  { name: 'Navaneethan G', mobile: '7010843268' },
  { name: 'Selva S', mobile: '9500757155' },
  { name: 'Saravana Kumar', mobile: '9500467115' },
  { name: 'Thapathi S', mobile: '9688429778' },
  { name: 'Tamilarasan S', mobile: '8489669007' },
  { name: 'Hariharan R', mobile: '7418905969' },
  { name: 'ASHOKRAJ JAYABALU', mobile: '7010767919' },
  { name: 'DHIVYA sri', mobile: '7339114854' },
  { name: 'Kamalchand M', mobile: '9345540147' },
  { name: 'Vignesh V', mobile: '9791924799' },
  { name: 'John Abrakan', mobile: '9361397693' },
  { name: 'Prakash Mani K M', mobile: '9566668919' },
  { name: 'Rajendra Prasad', mobile: '9535088015' },
  { name: 'Divya Bharathi E', mobile: '9025980056' },
  { name: 'Kamalesh P', mobile: '8220586500' },
  { name: 'Vasanthapriyan S', mobile: '8072517581' },
  { name: 'Franklin S', mobile: '9940354302' },
  { name: 'DIVAKAR K', mobile: '9345202753' },
  { name: 'A Suganth Kishor', mobile: '7892593316' },
  { name: 'Indhumathi D', mobile: '9092245688' },
  { name: 'Arulpravin S', mobile: '7200737022' },
  { name: 'Kannaiah G', mobile: '8939748945' },
  { name: 'Gajendhiran G', mobile: '7708915567' },
  { name: 'Sivambigai N', mobile: '9345713513' },
  { name: 'Suman A', mobile: '9789163790' },
  { name: 'SAFNA', mobile: '7530042690' },
  { name: 'Jayalakshmi', mobile: '9159088901' },
  { name: 'Manju R', mobile: '8508826500' },
  { name: 'ALBERT LEO', mobile: '9789827219' },
  { name: 'Gopika', mobile: '8939997284' },
  { name: 'Anu', mobile: '8637636169' },
  { name: 'kirthikarathi', mobile: '9965512596' },
  { name: 'suresh', mobile: '9894688881' },
  { name: 'Gayathiri', mobile: '9363225033' },
  { name: 'Nirmala', mobile: '6382756634' },
  { name: 'Inidha', mobile: '8300310470' },
  { name: 'sandhiya', mobile: '8807162341' },
  { name: 'Sai Rupa S', mobile: '6374235191' },
  { name: 'Babu v', mobile: '8220506174' },
  { name: 'Murugavelan', mobile: '9344914384' },
  { name: 'Thangakarupu', mobile: '8754244900' },
  { name: 'Ahameed', mobile: '8939786077' },
  { name: 'kandhahari', mobile: '9566550994' },
  { name: 'Madhan V', mobile: '8838720009' },
  { name: 'Rekka', mobile: '9787250572' },
  { name: 'Shalini S', mobile: '8270993024' },
  { name: 'Mervin', mobile: '9843768686' },
  { name: 'Tarun', mobile: '9345567819' },
  { name: 'PRATHIMA G', mobile: '8792158060' },
  { name: 'Kalidass', mobile: '6380032185' },
  { name: 'Selvakumari P', mobile: '7397519871' },
  { name: 'Kokila', mobile: '8072184308' },
  { name: 'Swathi', mobile: '9629353368' },
  { name: 'Surya', mobile: '8778814624' },
  { name: 'S KIRUTHIKA', mobile: '8148223109' },
  { name: 'Madhan Sanjay', mobile: '7094075748' },
  { name: 'Ranjith', mobile: '8675751157' },
  { name: 'SARAVANAN MUGIL', mobile: '8072643668' },
  { name: 'Lavanya P', mobile: '9659514848' },
  { name: 'Jeevanantham S', mobile: '9361633579' },
  { name: 'Venkateshkumar', mobile: '9600775986' },
  { name: 'Shanmugam Sundar', mobile: '9894110767' },
  { name: 'John Joel', mobile: '8508127711' },
  { name: 'U.JAYAKANTH', mobile: '6381739629' },
  { name: 'Kathirvel', mobile: '8189961820' },
  { name: 'Rajendra Prasath V', mobile: '6379935536' },
  { name: 'Manikantha', mobile: '8050518818' },
  { name: 'Lakshmipriya P', mobile: '9360998396' },
  { name: 'Roshan', mobile: '9894272540' },
  { name: 'Hariprasad', mobile: '9842023250' },
  { name: 'B.Surya Ganth', mobile: '7603801152' }
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
      const normalizedName = normalizeName(item.name);
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
