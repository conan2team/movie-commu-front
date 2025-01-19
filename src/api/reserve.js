import api from './axios';

export const reserveAPI = {
  // 영화의 모든 스케줄 조회
  getSchedules: async (movieId) => {
    // DEBUG: 스케줄 조회 요청
    // console.log('Fetching schedules for movie:', movieId);
    return api.get(`/schedule?movieId=${movieId}`);
  },

  // 예약된 좌석 조회
  getReservedSeats: async (scheduleId) => {
    // DEBUG: 예약된 좌석 조회
    // console.log('Fetching reserved seats for schedule:', scheduleId);
    return api.get(`/reservedSeat?scheduleId=${scheduleId}`);
  },

  // 좌석 예약하기
  reserve: async (reserveData) => {
    // DEBUG: 예약 요청 데이터
    // console.log('Reserve request data:', reserveData);
    const data = {
      method: reserveData.method,
      amount: reserveData.amount,
      pDate: new Date().toISOString().split('T')[0], // 현재 날짜를 YYYY-MM-DD 형식으로
      scheduleId: reserveData.scheduleId,
      seatId: reserveData.seatId
    };
    return api.post(`/reserve`, null, { params: data });
  },

  // 예약 취소하기
  cancelReserve: async (seatId, scheduleId) => {
    // DEBUG: 예약 취소 요청
    // console.log('Canceling reservation:', { seatId, scheduleId });
    return api.post(`/reserve/delete`, null, {
      params: { seatId, scheduleId }
    });
  },

  // 예매 취소
  deleteReservation: async (seatId, scheduleId) => {
    // DEBUG: 예매 취소 요청
    // console.log('Deleting reservation:', { seatId, scheduleId });
    const params = new URLSearchParams();
    params.append('seatId', seatId);
    params.append('scheduleId', scheduleId);
    
    return api.post('/reserve/delete', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}; 