import { createSlice } from "@reduxjs/toolkit";
import { getLocgetlStorage } from "../utils/util";

const initialState = {
  infoUser: JSON.parse(getLocgetlStorage("user")),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getInforUser: (state, action) => {
      state.infoUser = action.payload;
    },
  },
});

export const { getInforUser } = authSlice.actions;

export default authSlice.reducer;
