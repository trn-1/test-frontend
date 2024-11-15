import { createAsyncThunk } from '@reduxjs/toolkit'

import grAPI from 'core/api/goods-receipts'
import logger from 'core/common/logger'
import {
  TGROperation,
  TGROperationCreateBody,
} from 'core/models/goods-receipt/operation'

import { reducerPrefix } from './common'

const CREATE_OPERATION = `${reducerPrefix}/CREATE_OPERATION`

export const createOperation = createAsyncThunk<
  TGROperation,
  TGROperationCreateBody
>(
  CREATE_OPERATION,
  async (operation: TGROperationCreateBody, { rejectWithValue }) => {
    try {
      const response = await grAPI.createOperation(operation)
      return response
    } catch (e) {
      logger.error(e)
      return rejectWithValue(e)
    }
  }
)
