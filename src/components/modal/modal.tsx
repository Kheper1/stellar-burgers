import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    // Обработчик закрытия по Escape
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Добавляем слушатель при монтировании
    document.addEventListener('keydown', handleEsc);

    // Блокируем прокрутку страницы
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Убираем слушатель и восстанавливаем прокрутку при размонтировании
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!modalRoot) return null; // Защита, если элемент не найден

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
});
