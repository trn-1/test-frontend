import { createSlice } from '@reduxjs/toolkit'

import { TStateOperationsGR } from 'core/store/types/good-receipts/operations'

import { createOperation } from './actions'

export const initialState: TStateOperationsGR = {
  list: {},
  byIds: [],
  total: 0,
  creating: false,
  statusRules: [],
}

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOperation.pending, (state) => {
        state.creating = true
      })
      .addCase(createOperation.fulfilled, (state, action) => {
        const operation = action.payload
        state.creating = false
        state.byIds.unshift(operation.id)
        state.list[operation.id] = operation
        state.total += 1
      })
      .addCase(createOperation.rejected, (state) => {
        state.creating = false
      })
  },
})

export const { reducer } = operationsSlice
