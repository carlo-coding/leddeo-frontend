import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import React from 'react'

interface IModalState {
  open: boolean
  content: React.ReactElement
}

const modalState: IModalState = {
  open: false,
  content: <></>
}

const modalSlice = createSlice({
  name: 'modal',
  initialState: modalState,
  reducers: {
    openModal(state) {
      state.open = true
    },
    closeModal(state) {
      state.open = false
      state.content = <></>
    },
    setModalContent(state, action: PayloadAction<React.ReactElement>) {
      state.content = action.payload
    }
  }
})

export const { closeModal, openModal, setModalContent } = modalSlice.actions
export default modalSlice.reducer
