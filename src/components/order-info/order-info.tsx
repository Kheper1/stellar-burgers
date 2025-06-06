import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { getOrder } from '../../services/slices/orderSlice';
import { getIngredient } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const { isLoading: isIngredientsLoading, data: ingredients } = useSelector(
    (state: RootState) => state.ingredientsReducer
  );

  const { isOrderLoading, orderModalData: orderData } = useSelector(
    (state: RootState) => state.orderReducer
  );

  useEffect(() => {
    if (number) {
      dispatch(getOrder(Number(number)));
    }
    dispatch(getIngredient());
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    // Считаем количество каждого ингредиента
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (!ingredient) return acc;

        if (acc[id]) {
          acc[id].count += 1;
        } else {
          acc[id] = { ...ingredient, count: 1 };
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    // Общая стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isIngredientsLoading || isOrderLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return null;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
