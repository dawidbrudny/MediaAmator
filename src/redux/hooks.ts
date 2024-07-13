import { 
    type TypedUseSelectorHook,
    useSelector,
    useDispatch 
}
 from "react-redux";

import { RootState, AppDispatch } from "./store";

type DispatchFunction = () => AppDispatch;

export const useLoginDispatch: DispatchFunction = useDispatch;
export const useLoginSelector: TypedUseSelectorHook<RootState> = useSelector;