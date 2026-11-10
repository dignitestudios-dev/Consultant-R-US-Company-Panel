import { configureStore } from "@reduxjs/toolkit";
import auth from "@/features/auth/store/auth-slice";

export const makeStore = () => configureStore({ reducer: { auth } });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
