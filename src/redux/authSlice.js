import { createSlice } from "@reduxjs/toolkit";
import { getLocgetlStorage } from "../utils/util";
import { authService } from "../service/auth.service";
const initialState = {
  infoUser: authService.getMyInfo(getLocgetlStorage("token")),
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
