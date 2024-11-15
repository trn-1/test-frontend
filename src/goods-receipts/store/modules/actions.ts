import { createAsyncThunk } from '@reduxjs/toolkit'

import grAPI from 'core/api/goods-receipts'
import logger from 'core/common/logger'
import { TGROperationCreateBody } from 'core/models/goods-receipt/operation'

import { reducerPrefix } from './common'

const CREATE_OPERATION = `${reducerPrefix}/CREATE_OPERATION`

export const createOperation = createAsyncThunk(
  CREATE_OPERATION,
  async (operation: TGROperationCreateBody, { rejectWithValue }) => {
    try {
      return grAPI.createOperation(operation)
    } catch (e) {
      logger.error(e)
      return rejectWithValue(e)
    }
  }
)
