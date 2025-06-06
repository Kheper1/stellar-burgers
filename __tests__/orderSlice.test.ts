import orderSliceReducer, {
  getOrder,
  getOrders,
  createOrder,
  resetOrderModalData,
  initialState,
} from '../src/services/slices/orderSlice';

const ordersMockData = [
  {
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093d',
    ],
    _id: '6622337897ede0001d0666b5',
    status: 'done',
    name: 'TEST',
    createdAt: '2024-10-31T09:02:42.748Z',
    updatedAt: '2024-10-31T09:02:51.057Z',
    number: 38321,
  },
];

describe('orderSlice', () => {
  test('resetOrderModalData сбрасывает данные модального окна заказа', () => {
    const preloadedState = {
      isOrderLoading: true,
      isOrdersLoading: true,
      orderRequest: false,
      orderModalData: ordersMockData[0],
      error: null,
      data: [],
    };

    const state = orderSliceReducer(preloadedState, resetOrderModalData());

    expect(state.orderModalData).toBeNull();
    expect(state.data).toHaveLength(0);
    expect(state.error).toBeNull();
    expect(state.orderRequest).toBe(false);
    expect(state.isOrdersLoading).toBe(true);
    expect(state.isOrderLoading).toBe(true);
  });

  describe('getOrders (получение списка заказов)', () => {
    test('getOrders.pending устанавливает isOrdersLoading в true и сбрасывает ошибку', () => {
      const action = getOrders.pending('requestId');
      const state = orderSliceReducer(initialState, action);
      expect(state.isOrdersLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('getOrders.fulfilled устанавливает данные и сбрасывает isOrdersLoading и ошибку', () => {
      const action = getOrders.fulfilled(ordersMockData, 'requestId');
      const state = orderSliceReducer(initialState, action);
      expect(state.isOrdersLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(ordersMockData);
    });

    test('getOrders.rejected устанавливает ошибку и сбрасывает isOrdersLoading', () => {
      const errorMessage = 'getOrders.rejected';
      const error = new Error(errorMessage);
      const action = getOrders.rejected(error, 'requestId');
      const state = orderSliceReducer(initialState, action);
      expect(state.isOrdersLoading).toBe(false);
      expect(state.error?.message).toBe(errorMessage);
    });
  });

  describe('getOrder (получение заказа по номеру)', () => {
    test('getOrder.pending устанавливает isOrderLoading в true', () => {
      const action = getOrder.pending('requestId', ordersMockData[0].number);
      const state = orderSliceReducer(initialState, action);
      expect(state.isOrderLoading).toBe(true);
    });

    test('getOrder.fulfilled устанавливает orderModalData и сбрасывает isOrderLoading', () => {
      const action = getOrder.fulfilled(ordersMockData[0], 'requestId', ordersMockData[0].number);
      const state = orderSliceReducer(initialState, action);
      expect(state.isOrderLoading).toBe(false);
      expect(state.orderModalData).toEqual(ordersMockData[0]);
    });

    test('getOrder.rejected сбрасывает isOrderLoading', () => {
      const errorMessage = 'getOrder.rejected';
      const error = new Error(errorMessage);
      const action = getOrder.rejected(error, 'requestId', -1);
      const state = orderSliceReducer(initialState, action);
      expect(state.isOrderLoading).toBe(false);
    });
  });

  describe('createOrder (создание заказа)', () => {
    test('createOrder.pending устанавливает orderRequest в true', () => {
      const action = createOrder.pending('requestId', ordersMockData[0].ingredients);
      const state = orderSliceReducer(initialState, action);
      expect(state.orderRequest).toBe(true);
    });

    test('createOrder.fulfilled устанавливает orderModalData и сбрасывает orderRequest', () => {
      const payload = { order: ordersMockData[0], name: 'EXAMPLE' };
      const action = createOrder.fulfilled(payload, 'requestId', ordersMockData[0].ingredients);
      const state = orderSliceReducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(ordersMockData[0]);
    });

    test('createOrder.rejected сбрасывает orderRequest', () => {
      const errorMessage = 'createOrder.rejected';
      const error = new Error(errorMessage);
      const action = createOrder.rejected(error, 'requestId', []);
      const state = orderSliceReducer(initialState, action);
      expect(state.orderRequest).toBe(false);
    });
  });
});
