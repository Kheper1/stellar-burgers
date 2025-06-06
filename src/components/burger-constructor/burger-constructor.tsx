import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { AppDispatch, RootState } from '../../services/store';
import {
  createOrder,
  resetOrderModalData
} from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { resetConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.constructorReducer
  );
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.userReducer
  );
  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.orderReducer
  );

  // Если булки нет — создаём пустой объект с дефолтными значениями
  const safeBun = bun?._id
    ? bun
    : {
        _id: '',
        name: '',
        type: '',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      };

  const price = useMemo(() => {
    const bunPrice = safeBun.price * 2;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [safeBun, ingredients]);

  const onOrderClick = () => {
    if (!safeBun._id || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const orderIds = [
      safeBun._id,
      ...ingredients.map((item) => item._id),
      safeBun._id
    ];

    dispatch(createOrder(orderIds));
    dispatch(resetConstructor());
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun: safeBun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
