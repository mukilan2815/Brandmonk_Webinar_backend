const mongoose = require('mongoose');
const CourseStudent = require('../models/CourseStudent');
require('dotenv').config();

// Fuzzy-search for students reported as NOT FOUND by updateStudentPhones.js
const searchNames = ['Sharuk Basha S', 'Syed Aaqib S N'];

function normalizeName(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '');
}

// Simple Levenshtein distance
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

async function findMissing() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const allStudents = await CourseStudent.find({}).select('name courseName courseSlug certificateId phoneNumber');

    for (const target of searchNames) {
      const targetNorm = normalizeName(target);
      console.log(`\n━━━ Searching for: ${target} ━━━`);

      // Exact match anywhere in DB
      const exact = allStudents.filter(s => normalizeName(s.name) === targetNorm);
      if (exact.length > 0) {
        exact.forEach(s => console.log(`✅ EXACT: ${s.name} | ${s.courseName} | ${s.certificateId} | phone: ${s.phoneNumber || 'N/A'}`));
        continue;
      }

      // Fuzzy matches (name contains target words or low edit distance)
      const targetWords = targetNorm.split(' ');
      const fuzzy = allStudents
        .map(s => ({ s, dist: levenshtein(targetNorm, normalizeName(s.name)) }))
        .filter(({ dist }) => dist <= 4)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5);

      if (fuzzy.length > 0) {
        fuzzy.forEach(({ s, dist }) => console.log(`🔍 FUZZY (dist ${dist}): ${s.name} | ${s.courseName} | ${s.certificateId} | phone: ${s.phoneNumber || 'N/A'}`));
      } else {
        // Try partial word match
        const partial = allStudents.filter(s => {
          const nameNorm = normalizeName(s.name);
          return targetWords.some(w => w.length > 3 && nameNorm.includes(w));
        });
        if (partial.length > 0) {
          partial.slice(0, 5).forEach(s => console.log(`🔍 PARTIAL: ${s.name} | ${s.courseName} | ${s.certificateId} | phone: ${s.phoneNumber || 'N/A'}`));
        } else {
          console.log(`❌ No match found anywhere in DB for: ${target}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

findMissing();
