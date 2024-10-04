import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Blog {
  id: number;
  image: string;
  title: string;
  description: string;
  author: string;
  date: string;
  isHome: boolean;
}

export interface BlogsState {
  blogs: Blog[];
  currentPage: number;
  blogsPerPage: number;
}

const initialState: BlogsState = {
  blogs: [],
  currentPage: 1,
  blogsPerPage: 6,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },
  },
});

export const { setCurrentPage, setBlogs } = blogsSlice.actions;
export const blogsReducer = blogsSlice.reducer;

// Selectors
export const selectCurrentPageBlogs = (state: { blogs: BlogsState }) => {
  const startIndex = (state.blogs.currentPage - 1) * state.blogs.blogsPerPage;
  const endIndex = startIndex + state.blogs.blogsPerPage;
  return state.blogs.blogs.slice(startIndex, endIndex);
};

