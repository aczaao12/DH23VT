export const calculateFinalScore = (data, diem_dieu_kien) => {
  const total_diem_cong = data.reduce((sum, item) => sum + (Number(item['Điểm cộng']) || 0), 0);

  let diem_cuoi_cung;

  if (total_diem_cong > diem_dieu_kien) {
    diem_cuoi_cung = diem_dieu_kien;
  } else if (total_diem_cong < 60) {
    diem_cuoi_cung = 60;
  } else {
    diem_cuoi_cung = total_diem_cong;
  }

  return diem_cuoi_cung;
};

const levenshteinDistance = (a, b) => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};

const calculateSimilarity = (a, b) => {
  const longer = a.length > b.length ? a : b;
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  return (longer.length - distance) / longer.length;
};

/**
 * Calculates the conditional training score (điểm điều kiện) for a student
 * based on their list of approved activities.
 *
 * @param {Array<object>} approvedDocs - An array of the student's approved activity documents.
 *   Each document must have a 'Tên hoạt động' property.
 * @returns {number} The calculated conditional score (100, 95, or 90).
 */
export const calculateConditionalScore = (approvedDocs) => {
  // Get the names of all approved activities
  const activityNames = approvedDocs.map(doc => doc['Tên hoạt động']);

  // Define the key activity names
  const CLUB_ACTIVITY = "Có tham gia CLB học thuật";//points:4
  const RESEARCH_ACTIVITY = "Nghiên cứu khoa học (minh chứng rõ ràng nhất quán)";//points:10
  const OFFICER_ACTIVITY = "Sinh viên là cán bộ lớp, đoàn, hội, CLB đội, nhóm gương mẫu, hoàn thành tốt nhiệm vụ (được GVCV lớp, các tổ chức Đoàn, Hội đánh giá và công nhận)";//points:5
  const SPECIAL_ACHIEVEMENT = "Người học đạt được thành tích đặc biệt trong học tập, rèn luyện.";//points:10

  const hasActivity = (activityName, threshold = 0.8) => {
    return activityNames.some(name => calculateSimilarity(name, activityName) >= threshold);
  };

  // 1. Determine if the student has participated in the key activities
  const hasClub = hasActivity(CLUB_ACTIVITY);
  const hasResearch = hasActivity(RESEARCH_ACTIVITY);
  const hasOfficer = hasActivity(OFFICER_ACTIVITY);
  const hasSpecial = hasActivity(SPECIAL_ACHIEVEMENT);

  // 2. Count how many of the three main criteria are met
  const mainCriteriaCount =
    (hasClub ? 1 : 0) +
    (hasResearch ? 1 : 0) +
    (hasOfficer ? 1 : 0);

  let score;

  // 3. Apply the scoring rules
  if (mainCriteriaCount >= 2) {
    score = 100;
  } else if (mainCriteriaCount >= 1 || hasSpecial) {
    score = 95;
  } else {
    score = 90;
  }

  return score;
};