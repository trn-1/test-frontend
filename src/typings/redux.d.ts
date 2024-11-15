import { AsyncReducers } from 'core/store/types'

declare module 'redux' {
  export interface Store {
    asyncReducers: AsyncReducers
    injectReducer: (key: string, asyncReducer: Reducer) => void
  }
}
