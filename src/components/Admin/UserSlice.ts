import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  image: string;
  phone: string;
  email: string;
  password: string;
  account: string
  avatar: string;
  role: string;
  action: string[];
}

export interface UserState {
  user: User | {}

}

const initialState: UserState = {
    user: {}
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state,action: PayloadAction<User>) => {
        console.log(action);
        
        return {
            ...state,
            user: action.payload
        }
    }
  },
});

export const { setCurrentUser } = userSlice.actions;
export const userReducer = userSlice.reducer;


