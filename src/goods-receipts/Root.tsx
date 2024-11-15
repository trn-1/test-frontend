import React from 'react'
import { useStore } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import { GR_OPERATION_NEW } from 'core/common/routes'

import { NewOperationPage } from './pages/new-operation'
import { moduleKey as operationsModuleKey } from './store/modules/common'
import { reducer as operationsReducer } from './store/modules/slice'

export default function Root() {
  const store = useStore()
  const isInjected = React.useRef(false)

  if (!isInjected.current) {
    store.injectReducer(operationsModuleKey, operationsReducer)
    isInjected.current = true
  }

  return (
    <Switch>
      <Route exact path={GR_OPERATION_NEW} component={NewOperationPage} />
      <Redirect from="*" to={GR_OPERATION_NEW} />
    </Switch>
  )
}
