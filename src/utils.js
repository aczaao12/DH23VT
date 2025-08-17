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
