import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем состояние конструктора из стора
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state: RootState) => state.constructorReducer
  );

  // Считаем количество каждого ингредиента в конструкторе
  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2; // булка считается дважды
    }

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
