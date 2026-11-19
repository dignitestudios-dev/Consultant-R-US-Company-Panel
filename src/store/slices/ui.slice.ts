import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  serverError: boolean;
}

const slice = createSlice({
  name: "ui",
  initialState: { serverError: false } as UiState,
  reducers: {
    showServerError: (s) => {
      s.serverError = true;
    },
    hideServerError: (s) => {
      s.serverError = false;
    },
  },
});

export const { showServerError, hideServerError } = slice.actions;
export default slice.reducer;
