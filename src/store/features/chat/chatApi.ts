import socket from "@/lib/socket";
import { api } from "@/store/api";
import {
  createchat,
  pushchat,
  setValue,
  updateChat,
  updaterecentmessage,
} from "./chatReducer";
import {
  createmessage,
  pushmessage,
  setValue as setMessages,
  updateseen,
} from "./messageReducer";

export const chatApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addChat: builder.mutation({
      query: (connectionId) => {
        return {
          url: `/chat/${connectionId}`,
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(createchat(data));
      },
    }),
    addDirectChat: builder.mutation({
      query: (sellerId) => {
        return {
          url: `/chat/direct/${sellerId}`,
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(createchat(data));
      },
    }),
    connectAdmin: builder.mutation({
      query: (chatId) => {
        return {
          url: `/chat/${chatId}`,
          method: "PATCH",
        };
      },
    }),
    getChat: builder.query({
      query: (params = {}) => {
        let queryString = `/chat?page=1`;

        // Add search parameter if provided
        if (params.search) {
          queryString += `&search=${params.search}`;
        }

        // Add filter parameter if provided
        if (params.filter) {
          queryString += `&filter=${params.filter}`;
        }

        return queryString;
      },
      keepUnusedDataFor: 0,
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch((update, getState) => {
          const { pagination } = getState().chatStore;
          const { docs, ...rest } = data;
          update(setValue({ target: "chats", value: docs }));
          update(
            setValue({
              target: "pagination",
              value: { ...pagination, ...rest },
            })
          );
        });

        if (typeof window !== "undefined") {
          const tempChat = localStorage.getItem("tempChat");
          if (tempChat) {
            dispatch(createchat(JSON.parse(tempChat)));
            localStorage.removeItem("tempChat");
          }
        }

        if (!socket.connected) {
          socket.connect();
        }
        socket.on("seen", (data) => {
          if (data) {
            if (data.messages) dispatch(updateseen(data.messages));
            dispatch(updateChat(data.chat));
          }
        });
        socket.on("newChat", (data) => {
          dispatch(createchat(data));
        });
      },
    }),
    getMoreChat: builder.query({
      query: (params = {}) => {
        let queryString = `/chat?page=${params.page || 1}`;

        // Add search parameter if provided
        if (params.search) {
          queryString += `&search=${params.search}`;
        }

        // Add filter parameter if provided
        if (params.filter) {
          queryString += `&filter=${params.filter}`;
        }

        return queryString;
      },
      keepUnusedDataFor: 0,
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        dispatch((update, getState) => {
          const { pagination } = getState().chatStore;
          update(
            setValue({
              target: "pagination",
              value: { ...pagination, page: arg.page },
            })
          );
        });
        const { data } = await queryFulfilled;
        dispatch((update, getState) => {
          const { docs, ...rest } = data;
          update(pushchat(docs));
          const { pagination } = getState().chatStore;
          update(
            setValue({
              target: "pagination",
              value: { ...pagination, ...rest },
            })
          );
        });
      },
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, data }: { chatId: any; data: any }) => {
        return {
          url: `/message/${chatId}`,
          method: "POST",
          body: data,
        };
      },
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => {
        return `/message/${chatId}?page=${page || 1}`;
      },
      keepUnusedDataFor: 0,
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch((update, getState) => {
          const { docs, ...rest } = data;
          const { pagination } = getState().messageStore;
          update(setMessages({ target: "messages", value: data.docs }));
          update(
            setMessages({
              target: "pagination",
              value: { ...pagination, ...rest },
            })
          );
        });
        socket.emit("entry", { entry: true, room: arg.chatId });
        socket.on("message", (data) => {
          dispatch(createmessage(data));
          dispatch(
            updaterecentmessage({ chatId: arg.chatId, lastMessage: data })
          );
        });
      },
    }),
    getMoreMessages: builder.query({
      query: ({ chatId, page }) => {
        return `/message/${chatId}?page=${page || 1}`;
      },
      keepUnusedDataFor: 0,
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        dispatch((update, getState) => {
          const { pagination } = getState().messageStore;
          update(
            setMessages({
              target: "pagination",
              value: { ...pagination, page: arg.page },
            })
          );
        });
        const { data } = await queryFulfilled;
        dispatch((update, getState) => {
          const { docs, ...rest } = data;
          update(pushmessage(docs));
          const { pagination } = getState().messageStore;
          update(
            setMessages({
              target: "pagination",
              value: { ...pagination, ...rest },
            })
          );
        });
      },
    }),
  }),
});

export const {
  useAddChatMutation,
  useConnectAdminMutation,
  useAddDirectChatMutation,
  useSendMessageMutation,
  useLazyGetChatQuery,
  useLazyGetMoreChatQuery,
  useLazyGetMessagesQuery,
  useLazyGetMoreMessagesQuery,
} = chatApi;
