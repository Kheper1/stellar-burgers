import { FC, memo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useDispatch, useSelector, RootState } from '../../services/store'; // импорт из стора
import { getIngredient } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useDispatch(); // без <AppDispatch>

  useEffect(() => {
    dispatch(getIngredient());
  }, [dispatch]);

  const dataIngredients = useSelector(
    (state: RootState) => state.ingredientsReducer
  );

  const orderInfo = useMemo(() => {
    if (!dataIngredients.data.length) return null;

    const ingredientsInfo: TIngredient[] = order.ingredients
      .map((id) => dataIngredients.data.find((ing) => ing._id === id))
      .filter((ing): ing is TIngredient => ing !== undefined);

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains = Math.max(ingredientsInfo.length - maxIngredients, 0);

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, dataIngredients.data]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
