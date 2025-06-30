import { IChat, IMessage } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: IChat[];
  pagination: {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    nextPage: number | null;
    hasPrevPage: boolean;
    prevPage: number | null;
  }
}

const initialState: ChatState = {
  chats: [],
  pagination: {
    totalDocs: 1,
    limit: 10,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    nextPage: null,
    hasPrevPage: false,
    prevPage: null,
  }
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setValue: (
      state,
      action: PayloadAction<{ target: keyof ChatState; value: any }>
    ) => {
      // @ts-ignore
      state[action.payload.target] = action.payload.value;
    },

    createchat: (state, action: PayloadAction<IChat>) => {
      state.chats = [action.payload, ...state.chats];
    },

    pushchat: (state, action: PayloadAction<IChat[]>) => {
      state.chats = [...action.payload, ...state.chats];
    },

    updaterecentmessage: (
      state,
      action: PayloadAction<{ chatId: string, lastMessage: IMessage }>
    ) => {
      state.chats = state.chats.map((chat) =>
        chat.id === action.payload.chatId
          ? { ...chat, lastMessage: action.payload.lastMessage }
          : chat
      );
    },

    removechat: (state, action: PayloadAction<{ id: string }>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload.id);
    },

    updateChat: (
      state,
      action: PayloadAction<IChat>
    ) => {
      state.chats = state.chats.map((chat) =>
        chat.id === action.payload?.id ? { ...chat, ...action.payload } : chat
      );
    },
  },
});

export const {
  setValue,
  createchat,
  updateChat,
  removechat,
  pushchat,
  updaterecentmessage,
} = chatSlice.actions;

export default chatSlice.reducer;
