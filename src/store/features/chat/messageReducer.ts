import { IMessage, IUser } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface MessageState {
  messages: IMessage[];
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

const initialState: MessageState = {
  messages: [],
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

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setValue: (
      state,
      action: PayloadAction<{ target: keyof MessageState; value: any }>
    ) => {
      // @ts-ignore
      state[action.payload.target] = action.payload.value;
    },

    createmessage: (state, action: PayloadAction<IMessage>) => {
      state.messages = [action.payload, ...state.messages];
    },

    pushmessage: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = [...state.messages, ...action.payload];
    },

    updateseen: (
      state,
      action: PayloadAction<IMessage[]>
    ) => {
      const updatedMessages = action.payload;
      state.messages = state.messages.map((message) => {
        const updated = updatedMessages.find((m) => m.id === message.id);
        return updated ? { ...message, seens: updated.seens } : message;
      });
    },

    updatemessage: (state, action: PayloadAction<Partial<IMessage> & { id: string }>) => {
      state.messages = state.messages.map((message) =>
        message.id === action.payload.id ? { ...message, ...action.payload } : message
      );
    },
  },
});

export const {
  setValue,
  createmessage,
  pushmessage,
  updateseen,
  updatemessage,
} = messageSlice.actions;

export default messageSlice.reducer;
