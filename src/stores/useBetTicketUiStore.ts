import { create } from 'zustand'

interface BetTicketUiStore {
  isBetTicketCollapsed: boolean
  isMobileBetTicketOpen: boolean
  toggleBetTicketCollapsed: () => void
  setMobileBetTicketOpen: (isOpen: boolean) => void
}

export const useBetTicketUiStore = create<BetTicketUiStore>((set, get) => ({
  isBetTicketCollapsed: false,
  isMobileBetTicketOpen: false,
  toggleBetTicketCollapsed: () => {
    set({ isBetTicketCollapsed: !get().isBetTicketCollapsed })
  },
  setMobileBetTicketOpen: (isOpen) => {
    set({ isMobileBetTicketOpen: isOpen })
  },
}))
