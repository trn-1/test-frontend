import { Reducer } from '@reduxjs/toolkit'
import { RouterState } from 'connected-react-router'
import { moduleKey as operationsGR } from 'goods-receipts/store/modules/common'
import { Location } from 'history'

import { store } from '../index'
import { moduleKey as commonModuleKey } from '../modules/common'
import { moduleKey as stuffModuleKey } from '../modules/stuff'
import { TStateOperationsGR } from './good-receipts/operations'
import { TCommonState } from './modules/common'
import { TStuffState } from './modules/stuff'

export type AppDispatch = typeof store.dispatch

export type AsyncReducers = Record<string, Reducer>

export type TRootState = {
  router: RouterState<Location>
  [stuffModuleKey]: TStuffState
  [commonModuleKey]: TCommonState
  [operationsGR]: TStateOperationsGR
}
