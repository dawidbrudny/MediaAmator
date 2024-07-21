import { 
    type TypedUseSelectorHook,
    useSelector,
    useDispatch 
}
 from "react-redux";

import { RootState, AppDispatch } from "./store";

type DispatchFunction = () => AppDispatch;

export const useAppDispatch: DispatchFunction = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;