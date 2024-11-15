import { createSelector } from 'reselect'

import { ModuleSelector } from 'core/interfaces/utils'
import { TRootState } from 'core/store/types'
import { TStateOperationsGR } from 'core/store/types/good-receipts/operations'

import { moduleKey } from './common'

function moduleSelector<T extends unknown[], R>(
  selector: ModuleSelector<TStateOperationsGR, T, R>
) {
  return (globalState: TRootState, ...args: T) =>
    selector(globalState[moduleKey], ...args)
}

export const selectList = moduleSelector((state) => state.list || {})

export const selectStatusRules = moduleSelector((state) => state.statusRules)

export const operationByIdSelector = createSelector(
  [selectList, (_, opId: number) => opId],
  (list, opId) => list[opId] || null
)

export const selectFinalRule = createSelector(
  selectStatusRules,
  (statusRules) => statusRules.find((rule) => rule.final)
)

export const isOperationReadOnlySelector = createSelector(
  [operationByIdSelector, selectFinalRule],
  (operation, finalRule) => {
    return operation && finalRule ? operation.status === finalRule.id : false
  }
)
