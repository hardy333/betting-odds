import { create } from 'zustand'

interface BetTicketUiStore {
  isBetTicketCollapsed: boolean
  toggleBetTicketCollapsed: () => void
}

export const useBetTicketUiStore = create<BetTicketUiStore>((set, get) => ({
  isBetTicketCollapsed: false,
  toggleBetTicketCollapsed: () => {
    set({ isBetTicketCollapsed: !get().isBetTicketCollapsed })
  },
}))
