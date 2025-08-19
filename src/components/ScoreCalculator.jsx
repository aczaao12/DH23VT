import { useState } from 'react';
import './ScoreCalculator.css';

const ScoreCalculator = () => {
  const [criteria, setCriteria] = useState({
    clb: false,
    nckh: false,
    bcs: false,
    hoatDongCao: false,
  });
  const [sinhHoat, setSinhHoat] = useState('yes');
  const [finalScore, setFinalScore] = useState(null);
  const [message, setMessage] = useState('');

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCriteria((prevCriteria) => ({ ...prevCriteria, [id]: checked }));
  };

  const handleRadioChange = (event) => {
    setSinhHoat(event.target.value);
  };

  const calculateScore = () => {
    let maxScore = 90;
    const { clb, nckh, bcs, hoatDongCao } = criteria;
    let criteriaCount = 0;
    if (clb) criteriaCount++;
    if (nckh) criteriaCount++;
    if (bcs) criteriaCount++;

    if (criteriaCount >= 2) {
      maxScore = 100;
    } else if (clb || nckh || bcs || hoatDongCao) {
      maxScore = 95;
    }

    let score = maxScore;
    if (sinhHoat === 'no') {
      score -= 5;
    }

    setFinalScore(score);
  };

  return (
    <div className="score-calculator-body">
      <div className="score-calculator-container">
        <h1 className="score-calculator-h1">Công cụ tính điểm rèn luyện</h1>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="score-calculator-h2">1. Các tiêu chí cộng điểm</h2>
            <div className="space-y-3">
              <label className="flex items-center text-gray-700">
                <input type="checkbox" id="clb" name="tieuChi" onChange={handleCheckboxChange} />
                Tham gia Câu lạc bộ học thuật (CLB), có xác nhận hoạt động và thành tích.
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" id="nckh" name="tieuChi" onChange={handleCheckboxChange} />
                Có Nghiên cứu khoa học (NCKH) được công nhận.
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" id="bcs" name="tieuChi" onChange={handleCheckboxChange} />
                Là thành viên Ban cán sự (BCS) lớp, Đoàn, Hội.
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" id="hoatDongCao" name="tieuChi" onChange={handleCheckboxChange} />
                Có tổng số hoạt động tham gia cao nhất (trường hợp đặc biệt).
              </label>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="score-calculator-h2">2. Hoạt động bắt buộc</h2>
            <div className="space-y-3">
              <p className="text-gray-700 font-medium">Bạn có tham gia Sinh hoạt Chi đoàn không?</p>
              <label className="inline-flex items-center text-gray-700">
                <input type="radio" name="sinhHoat" value="yes" checked={sinhHoat === 'yes'} onChange={handleRadioChange} />
                Có
              </label>
              <label className="inline-flex items-center text-gray-700 ml-6">
                <input type="radio" name="sinhHoat" value="no" checked={sinhHoat === 'no'} onChange={handleRadioChange} />
                Không
              </label>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={calculateScore} className="calculate-button">
              Tính điểm rèn luyện
            </button>
          </div>
          {finalScore !== null && (
            <div className="result-box">
              <p className="result-text">Điểm rèn luyện tối đa của bạn là: {finalScore} điểm.</p>
            </div>
          )}
        </div>
        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
};

export default ScoreCalculator;
