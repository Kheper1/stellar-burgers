import userSliceReducer, {
  getUser,
  updateUser,
  register,
  login,
  logoutUser,
  initialState,
} from '../src/services/slices/userSlice';

const userMockData = {
  email: 'test@test.test',
  name: 'testtest',
};

const registerMockData = {
  email: 'test@test.test',
  name: 'testtest',
  password: 'testtest',
};

const loginMockData = {
  email: 'test@test.test',
  password: 'testtest',
};

describe('userSlice', () => {
  describe('Регистрация пользователя (register)', () => {
    test('register.pending сбрасывает ошибку регистрации', () => {
      const action = register.pending('requestId', registerMockData);
      const state = userSliceReducer(initialState, action);
      expect(state.registerError).toBeUndefined();
    });

    test('register.fulfilled устанавливает данные пользователя и флаг аутентификации', () => {
      const action = register.fulfilled(userMockData, 'requestId', registerMockData);
      const state = userSliceReducer(initialState, action);
      expect(state.isAuthenticated).toBe(true);
      expect(state.registerError).toBeUndefined();
      expect(state.data).toEqual(userMockData);
    });

    test('register.rejected устанавливает ошибку регистрации', () => {
      const errorMessage = 'register.rejected';
      const error = new Error(errorMessage);
      const action = register.rejected(error, 'requestId', registerMockData);
      const state = userSliceReducer(initialState, action);
      expect(state.registerError?.message).toBe(errorMessage);
    });
  });

  // Остальные тесты без изменений...
});
