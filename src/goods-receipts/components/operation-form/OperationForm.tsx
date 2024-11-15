import React, { useCallback, useRef, useState } from 'react'
import { Form } from 'react-final-form'

import { FORM_ERROR } from 'final-form'
import createDecorator from 'final-form-focus'

import grAPI from 'core/api/goods-receipts'
import logger from 'core/common/logger'
import {
  TGROperation,
  TGROperationCreateBody,
} from 'core/models/goods-receipt/operation'
import {
  getInitialValues,
  normalize,
  validate,
} from 'core/validation/operations.gr'

import ExistOperationWithSupNumberAlert from './ExistOperationWithSupNumberAlert'
import { OperationFormRenderer } from './OperationFormRenderer'

const focusOnErrors = createDecorator()

interface IOperationFormProps {
  operation: Partial<TGROperation>
  onSubmit: (formData: TGROperationCreateBody) => Promise<void>
}

export default function OperationForm({
  operation,
  onSubmit,
}: IOperationFormProps) {
  const [isVisibleAlert, setIsVisibleAlert] = useState(false)

  const formDataRef = useRef<Partial<TGROperation>>()
  const existSupNumberRef = useRef<TGROperation['supNumber']>()

  // Ф-кция проверяет номер отгрузки поставщика на совпадения с другими операциями приёмки
  const checkOperationHasExistSupNumber = useCallback(
    async (supNumber: TGROperation['supNumber']): Promise<string | null> => {
      if (!supNumber) {
        return null
      }

      try {
        const operationsResponse = await grAPI.getOperationsList({ supNumber })
        if (!operationsResponse.total) {
          return null
        }
        return (
          operationsResponse.list.find(
            ({ supNumber: supNumberResponse }) =>
              supNumberResponse === supNumber
          )?.supNumber || null
        )
      } catch (e) {
        logger.error(e)
        return null
      }
    },
    []
  )

  const handleSubmit = useCallback(
    async (confirmAlert = false) => {
      try {
        if (
          formDataRef.current?.supNumber &&
          formDataRef.current?.supNumber !== operation.supNumber &&
          !confirmAlert
        ) {
          const existSupNumber = await checkOperationHasExistSupNumber(
            formDataRef.current?.supNumber
          )

          if (existSupNumber !== null) {
            existSupNumberRef.current = existSupNumber
            setIsVisibleAlert(true)
            return
          }
        }

        onSubmit(normalize(formDataRef.current))
      } catch (e) {
        return { [FORM_ERROR]: e }
      }
    },
    [checkOperationHasExistSupNumber, onSubmit, operation.supNumber]
  )

  const initialValues = getInitialValues(operation)

  const isNew = !initialValues.id

  return (
    <>
      {/* Alert для подтвержения сохранения формы при совпадении номера отгрузки с другими операциями приёмки */}
      {isVisibleAlert && (
        <ExistOperationWithSupNumberAlert
          isOpen={isVisibleAlert}
          closeAlert={() => setIsVisibleAlert(false)}
          supNumber={existSupNumberRef.current}
          confirmAlert={() => {
            handleSubmit(true)
          }}
        />
      )}
      <Form
        decorators={[focusOnErrors]}
        onSubmit={(values) => {
          formDataRef.current = values
          handleSubmit()
        }}
        initialValues={initialValues}
        validate={validate}
        component={(props) => (
          <OperationFormRenderer
            operation={operation}
            isNew={isNew}
            {...props}
          />
        )}
      />
    </>
  )
}
