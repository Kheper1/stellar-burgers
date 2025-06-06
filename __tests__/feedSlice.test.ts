import feedSliceReducer, { initialState, getFeeds } from '../src/services/slices/feedSlice';

const feedsMockData = {
  orders: [],
  total: 1,
  totalToday: 1,
};

describe('feedSlice', () => {
  describe('Асинхронный экшен getFeeds', () => {
    test('getFeeds.pending устанавливает isLoading в true и сбрасывает ошибку', () => {
      const action = getFeeds.pending('requestId');
      const state = feedSliceReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('getFeeds.fulfilled устанавливает данные и сбрасывает isLoading и ошибку', () => {
      const action = getFeeds.fulfilled(feedsMockData, 'requestId');
      const state = feedSliceReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(feedsMockData);
    });

    test('getFeeds.rejected устанавливает ошибку и сбрасывает isLoading', () => {
      const errorMessage = 'Network error';
      const error = new Error(errorMessage);
      const action = getFeeds.rejected(error, 'requestId');
      const state = feedSliceReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error?.message).toBe(errorMessage);
    });
  });
});
