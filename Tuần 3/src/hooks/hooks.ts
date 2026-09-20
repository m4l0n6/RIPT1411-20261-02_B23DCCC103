import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Dùng 2 hook này thay cho useDispatch/useSelector "trần" trong toàn bộ component,
// để có type-safety đầy đủ (không cần khai báo lại kiểu ở từng nơi dùng).
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
