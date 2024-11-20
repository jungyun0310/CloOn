import React, { useEffect, useState } from 'react';
import axios from '../axios';

const Mypage = ({ sInfo }) => {

  useEffect(() => {
    if (sInfo) {
      localStorage.setItem('sInfo', JSON.stringify(sInfo));
    }
  }, [sInfo]);

  const storedInfo = localStorage.getItem('sInfo');
  const parsedInfo = storedInfo ? JSON.parse(storedInfo) : null;

  // sInfo를 props로 받지 못했을 경우 parsedInfo를 사용
  const finalInfo = sInfo || parsedInfo;
  console.log(finalInfo.user_id);

  const [measurements, setMeasurements] = useState([]);
  const [latestMeasurement, setLatestMeasurement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get('/measurement/mypage', {
          params: { user_id: finalInfo.user_id }
        });

        if (response.data.measurements.length > 0) {
          setMeasurements(response.data.measurements);
          setLatestMeasurement(response.data.measurements[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching measurements:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeasurements();
  }, [finalInfo?.user_id]);

  const openModal = (imageUrl) => {
    console.log("Opening modal with image URL:", imageUrl);
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div>Try 버튼을 누른 후 신체 치수 측정을 완료해주세요 ...</div>;
  if (error) return <div>{error}</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className='body-container'>
      <div className='content-wrapper'>
        {/* 왼쪽 인체 실루엣 */}
        <div className='body-section'>
          <img src='/img/bodyshape2.png' alt="body silhouette" />

          {/* 사각형 데이터 삽입 */}
          <div className="data-box data-box-1">상체길이 {latestMeasurement.upper_length * 100}cm</div>
          <div className="data-box data-box-2">가슴단면 {latestMeasurement.chest_width * 100}cm</div>
          <div className="data-box data-box-3">팔뚝길이 {latestMeasurement.forearm_length * 100}cm</div>
          <div className="data-box data-box-4">팔 길이 {latestMeasurement.arm_length * 100}cm</div>
          <div className="data-box data-box-5">엉덩이 단면 {latestMeasurement.hip_width * 100}cm</div>
          <div className="data-box data-box-6">허벅지단면 {latestMeasurement.thigh_width * 100}cm</div>
          <div className="data-box data-box-7">다리 길이 {latestMeasurement.leg_length * 100}cm</div>
          <div className="data-box data-box-8">허리단면 {latestMeasurement.waist_width * 100}cm</div>

          {/* 키와 몸무게 */}
          <div className='stats-section'>
            <div className='stat-item'>
              <div className='value-container'>
                <div className='value'>{latestMeasurement.height}</div>
                <div className='unit'>cm</div>
              </div>
              <div className='label'>키</div>
            </div>
            <div className='stat-item'>
              <div className='value-container'>
                <div className='value'>{latestMeasurement.weight}</div>
                <div className='unit'>kg</div>
              </div>
              <div className='label'>몸무게</div>
            </div>
          </div>
        </div>

        {/* 오른쪽 신체 치수 테이블 섹션 */}
        <div className="table-container">
          <h2 className="welcome-text">마이페이지</h2>
          <div className="table-section">
            <table>
              <thead>
                <tr>
                  <th>측정 날짜</th>
                  <th>어깨 너비</th>
                  <th>가슴 단면</th>
                  <th>팔 길이</th>
                  <th>팔뚝 길이</th>
                  <th>상체 길이</th>
                  <th>허리 단면</th>
                  <th>엉덩이 단면</th>
                  <th>허벅지 단면</th>
                  <th>다리 길이</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement, index) => (
                  <tr key={index} onClick={() => openModal(measurement.image)} >
                    <td>{formatDate(measurement.measurement_date)}</td>
                    <td>{measurement.shoulder_width * 100}</td>
                    <td>{measurement.chest_width * 100}</td>
                    <td>{measurement.arm_length * 100}</td>
                    <td>{measurement.forearm_length * 100}</td>
                    <td>{measurement.upper_length * 100}</td>
                    <td>{measurement.waist_width * 100}</td>
                    <td>{measurement.hip_width * 100}</td>
                    <td>{measurement.thigh_width * 100}</td>
                    <td>{measurement.leg_length * 100}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <img
              src={selectedImage}
              alt="Result"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onError={(e) => console.log("Image loading error:", e)} // 이미지 로딩 에러 확인
            />
            <button onClick={closeModal} style={modalStyles.closeButton}>
              닫기
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


// 모달 스타일 정의
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '90%',
    maxHeight: '90%',
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#ff5e57',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};


export default Mypage;