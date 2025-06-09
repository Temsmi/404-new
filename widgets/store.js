import { create } from 'zustand';

export const useChatStore = create((set) => ({
  activeChannelId: null,
  setActiveChannelId: (id) => set({ activeChannelId: id }),

    lastViewed: {},
  setLastViewed: (channelId, messageId) =>
    set((state) => ({
      lastViewed: { ...state.lastViewed, [channelId]: messageId },
    })),
}));

export const useNotificationStore = create((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: (amount = 1) =>
    set((state) => ({ unreadCount: state.unreadCount + amount })),
  resetUnread: () => set({ unreadCount: 0 }),
}));