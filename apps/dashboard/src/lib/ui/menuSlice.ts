import { createSlice } from '@reduxjs/toolkit'

export interface MenuState {
  open?: boolean
}

const initialState: MenuState = {
    open: false
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openMenu: (state) => {
      state.open = true
    },
    closeMenu: (state) => {
      state.open = false
    },
    toggleMenu: (state) => {
      state.open = !state.open
    },
  },
})

// Action creators are generated for each case reducer function
export const { openMenu, closeMenu, toggleMenu } = menuSlice.actions

export default menuSlice.reducer