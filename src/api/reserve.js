import api from './axios';

export const reserveAPI = {
  // 영화의 모든 스케줄 조회
  getSchedules: (movieId) => {
    return api.get(`/schedule?movieId=${movieId}`);
  },

  // 예약된 좌석 조회
  getReservedSeats: (scheduleId) => {
    return api.get(`/reservedSeat?scheduleId=${scheduleId}`);
  },

  // 좌석 예약하기
  reserve: (reserveData) => {
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
  cancelReserve: (seatId, scheduleId) => {
    return api.post(`/reserve/delete`, null, {
      params: { seatId, scheduleId }
    });
  }
}; 