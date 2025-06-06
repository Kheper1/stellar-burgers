import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector, RootState } from '../../services/store'; // импорт из стора
import { getIngredient } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch(); // без <AppDispatch>

  useEffect(() => {
    dispatch(getIngredient());
  }, [dispatch]);

  const ingredientStore = useSelector(
    (state: RootState) => state.ingredientsReducer.data
  );

  const ingredientData = ingredientStore.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
