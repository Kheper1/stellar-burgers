import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store'; // Импорт из стора
import {
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // без <AppDispatch>

    const handleMoveDown = useCallback(() => {
      dispatch(moveDownIngredient(index));
    }, [dispatch, index]);

    const handleMoveUp = useCallback(() => {
      dispatch(moveUpIngredient(index));
    }, [dispatch, index]);

    const handleClose = useCallback(() => {
      dispatch(removeIngredient(ingredient));
    }, [dispatch, ingredient]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
