import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import { Card } from '@blueprintjs/core'

import { push } from 'connected-react-router'
import { OperationForm } from 'goods-receipts/components/operation-form'
import {
  DEFAULT_CREATE_NEW_TYPE,
  getLinkAfterSuccessCreation,
  GR_CREATE_NEW_OP_TYPE_LOCAL_STORAGE_KEY,
} from 'goods-receipts/components/operation-form/common'
import { createOperation } from 'goods-receipts/store/modules/actions'
import moment from 'moment'

import { isNotCancelRequest } from 'core/common/api'
import logger from 'core/common/logger'
import appStorage from 'core/common/storage'
import {
  AppToaster,
  ContentLayout,
  PageHead,
  PageHeader,
  PageLayout,
} from 'core/components'
import {
  TGROperation,
  TGROperationCreateBody,
} from 'core/models/goods-receipt/operation'
import { selectCurrentEmployeeId } from 'core/store/modules/common'
import { selectEmployeeById } from 'core/store/modules/stuff'
import { TRootState, useAppThunkDispatch } from 'core/store/types'
import LayoutStyles from 'core/styles/layout.module.scss'

import NewOperationBreadcrumbs from './NewOperationBreadcrumbs'

export default function NewOperationPage() {
  const dispatch = useAppThunkDispatch()

  const currentEmployeeId = useSelector(selectCurrentEmployeeId)
  const currentEmployee = useSelector(
    (state: TRootState) => selectEmployeeById(state, currentEmployeeId),
    shallowEqual
  )

  // начальные значения формы
  const operationDraft: Partial<TGROperation> = {
    worker: currentEmployee,
    creator: currentEmployee,
    createDate: moment().toISOString(),
    repaymentPeriod: null,
  }

  const handleCreateOperation = async (formData: TGROperationCreateBody) => {
    try {
      const result = await dispatch(createOperation(formData)).unwrap()

      AppToaster.success({
        message: 'Операция успешно создана',
      })

      const savedOption =
        appStorage.getItem(GR_CREATE_NEW_OP_TYPE_LOCAL_STORAGE_KEY) ||
        DEFAULT_CREATE_NEW_TYPE

      const newPositionUrl = getLinkAfterSuccessCreation(
        savedOption,
        String(result.id)
      )

      dispatch(push(newPositionUrl))
    } catch (e) {
      if (isNotCancelRequest(e)) {
        logger.error(e)
        throw e
      }
    }
  }

  return (
    <PageLayout>
      <ContentLayout>
        <PageHeader>
          <PageHead>
            <NewOperationBreadcrumbs />
          </PageHead>
        </PageHeader>
        <Card elevation={1} className={LayoutStyles.MainCard}>
          <OperationForm
            operation={operationDraft}
            onSubmit={handleCreateOperation}
          />
        </Card>
      </ContentLayout>
    </PageLayout>
  )
}
