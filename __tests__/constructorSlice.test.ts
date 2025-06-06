import {
  addBun,
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetConstructor,
} from '../src/services/slices/constructorSlice';

import constructorSliceReducer, { initialState } from '../src/services/slices/constructorSlice';

const bunMockData = {
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
};

const ingredient1MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '1234567890',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0,
};

const ingredient2MockData = {
  _id: '643d69a5c3f7b9001cfa093f', // исправлен id, чтобы отличался от ingredient1
  id: '9876543210',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0,
};

describe('constructorSlice', () => {
  describe('Булки', () => {
    test('addBun устанавливает булку и очищает ингредиенты', () => {
      const state = constructorSliceReducer(initialState, addBun(bunMockData));
      expect(state.bun).toEqual(bunMockData);
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Ингредиенты', () => {
    test('addIngredient добавляет ингредиент', () => {
      const state = constructorSliceReducer(initialState, addIngredient(ingredient1MockData));
      expect(state.ingredients).toHaveLength(1);

      // Проверяем, что объект ингредиента соответствует, игнорируя поле id (уникальный идентификатор)
      const ingredientInState = { ...state.ingredients[0] };
      delete ingredientInState.id;

      const originalIngredient = { ...ingredient1MockData };
      delete originalIngredient.id;

      expect(ingredientInState).toEqual(originalIngredient);
      expect(state.bun).toBeNull();
    });

    test('removeIngredient удаляет указанный ингредиент', () => {
      const preloadedState = {
        bun: null,
        ingredients: [ingredient1MockData, ingredient2MockData],
      };
      const state = constructorSliceReducer(preloadedState, removeIngredient(ingredient1MockData));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(ingredient2MockData);
      expect(state.bun).toBeNull();
    });

    describe('Передвижение ингредиентов', () => {
      test('moveDownIngredient меняет местами ингредиенты вниз', () => {
        const preloadedState = {
          bun: null,
          ingredients: [ingredient1MockData, ingredient2MockData],
        };
        const state = constructorSliceReducer(preloadedState, moveDownIngredient(0));
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0]).toEqual(ingredient2MockData);
        expect(state.ingredients[1]).toEqual(ingredient1MockData);
        expect(state.bun).toBeNull();
      });

      test('moveUpIngredient меняет местами ингредиенты вверх', () => {
        const preloadedState = {
          bun: null,
          ingredients: [ingredient1MockData, ingredient2MockData],
        };
        const state = constructorSliceReducer(preloadedState, moveUpIngredient(1));
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0]).toEqual(ingredient2MockData);
        expect(state.ingredients[1]).toEqual(ingredient1MockData);
        expect(state.bun).toBeNull();
      });
    });

    test('resetConstructor очищает булку и ингредиенты', () => {
      const preloadedState = {
        bun: bunMockData,
        ingredients: [ingredient1MockData, ingredient2MockData],
      };
      const state = constructorSliceReducer(preloadedState, resetConstructor());
      expect(state.ingredients).toHaveLength(0);
      expect(state.bun).toBeNull();
    });
  });
});
