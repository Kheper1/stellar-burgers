import ingredientsSliceReducer, { initialState, getIngredient } from '../src/services/slices/ingredientsSlice';

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  },
];

describe('ingredientsSlice', () => {
  describe('Асинхронный экшен getIngredient', () => {
    test('getIngredient.pending устанавливает isLoading в true и сбрасывает ошибку', () => {
      const action = getIngredient.pending('requestId');
      const state = ingredientsSliceReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('getIngredient.fulfilled устанавливает данные и сбрасывает isLoading и ошибку', () => {
      const action = getIngredient.fulfilled(ingredientsMockData, 'requestId');
      const state = ingredientsSliceReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(ingredientsMockData);
    });

    test('getIngredient.rejected устанавливает ошибку и сбрасывает isLoading', () => {
      const errorMessage = 'Network error';
      const error = new Error(errorMessage);
      const action = getIngredient.rejected(error, 'requestId');
      const state = ingredientsSliceReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error?.message).toBe(errorMessage);
    });
  });
});
