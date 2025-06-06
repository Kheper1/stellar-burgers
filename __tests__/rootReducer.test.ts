import { rootReducer, store } from '../src/services/store';

describe('rootReducer', () => {
  test('При неизвестном действии и undefined состоянии возвращается начальное состояние', () => {
    const initialState = store.getState();
    const resultState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(resultState).toEqual(initialState);
  });
});
