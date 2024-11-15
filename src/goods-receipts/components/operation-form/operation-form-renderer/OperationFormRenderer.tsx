import React, { useCallback, useMemo, useEffect, useRef } from 'react'
import { Field, FormRenderProps, FormSpy } from 'react-final-form'
import { shallowEqual, useSelector } from 'react-redux'

import {
  Button,
  Classes,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core'
import { DateInput, TimePrecision } from '@blueprintjs/datetime'
import { IconNames } from '@blueprintjs/icons'
import { Tooltip2 } from '@blueprintjs/popover2'

import { isDate } from 'lodash-es'
import moment from 'moment'

import { localeUtils } from 'core/common/date'
import { getFormFieldId } from 'core/common/forms'
import {
  CopyNumberButton,
  EmployeeSelect,
  ErrorAlert,
  HTMLForm,
} from 'core/components'
import { WhenFieldChanges } from 'core/components/form/Form'
import { TGROperation } from 'core/models/goods-receipt/operation'
import { selectEmployees } from 'core/store/modules/stuff'
import { TRootState } from 'core/store/types'
import { TGROperationSchema } from 'core/validation/operations.gr'

import {
  FIELD_CREATE_DATE,
  FIELD_CREATOR,
  FIELD_MANUAL_NUMBER,
  FIELD_NUMBER,
  FIELD_SUP_NUMBER,
  FIELD_SUP_SHIPMENT_DATE,
  FIELD_WORKER,
  FORM_CREATE_DATE_LABEL,
  FORM_CREATOR_LABEL,
  FORM_NUMBER_LABEL,
  FORM_NUMBER_NOTE_AUTO,
  FORM_NUMBER_NOTE_MANUAL,
  FORM_SUPPLIER_DATE_LABEL,
  FORM_SUPPLIER_NUMBER_LABEL,
  FORM_WORKER_LABEL,
} from '../constants'
import { CreateOperationButton } from './CreateOperationButton'
import { OperationMixedAgreements } from './OperationMixedAgreements'

interface IOperationFormRendererProps
  extends FormRenderProps<Partial<TGROperationSchema>> {
  operation: Partial<TGROperation>
  isNew: boolean
}

export function OperationFormRenderer({
  form,
  handleSubmit,
  operation,
  isNew,
}: IOperationFormRendererProps) {
  const maxDate = useMemo(() => new Date(), [])

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const numberRef = useRef<HTMLInputElement | null>(null)
  const mixedAgreementsRef = useRef<
    HTMLInputElement | HTMLButtonElement | null
  >(null)
  const workerRef = useRef<HTMLButtonElement | null>(null)
  const workerInputRef = useRef<HTMLInputElement | null>(null)
  const creatorRef = useRef<HTMLButtonElement | null>(null)
  const creatorInputRef = useRef<HTMLInputElement | null>(null)
  const createDateRef = useRef<HTMLInputElement | null>(null)
  const supNumberRef = useRef<HTMLInputElement | null>(null)
  const supShipmentDateRef = useRef<HTMLInputElement | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)
  const dateInputRef = useRef<DateInput>(null)

  const mapStateToProps = (state: TRootState) => ({
    employees: selectEmployees(state),
  })

  const { employees } = useSelector(mapStateToProps, shallowEqual)

  const handleSelectCreator = useCallback(
    (creator) => form.change(FIELD_CREATOR, creator),
    [form]
  )
  const handleSelectWorker = useCallback(
    (worker) => form.change(FIELD_WORKER, worker),
    [form]
  )

  const handleChangeCreateDate = useCallback(
    (date) => {
      return form.change(
        FIELD_CREATE_DATE,
        isDate(date) ? moment(date).toISOString() : undefined
      )
    },
    [form]
  )
  const handleChangeSupShipmentDate = useCallback(
    (date) =>
      form.change(
        FIELD_SUP_SHIPMENT_DATE,
        isDate(date) ? moment(date).toISOString() : null
      ),
    [form]
  )

  useEffect(() => {
    const handleOnEnter = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      const refs = [
        numberRef,
        mixedAgreementsRef,
        createDateRef,
        workerRef,
        creatorRef,
        supNumberRef,
        supShipmentDateRef,
        submitButtonRef,
      ]

      const refIndex = refs.findLastIndex((ref) => e.target === ref.current)

      if (refIndex !== -1 && refs[refIndex + 1]) {
        timerRef.current = setTimeout(
          () => refs[refIndex + 1].current?.focus(),
          200
        )
      }
    }

    document.addEventListener('keydown', handleOnEnter)

    return () => {
      document.removeEventListener('keydown', handleOnEnter)

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <HTMLForm onSubmit={handleSubmit} fill>
      <FormSpy
        subscription={{ values: true }}
        render={({ values }) => {
          return (
            <Field
              name={FIELD_NUMBER}
              render={({ input, meta }) => (
                <FormGroup
                  label={FORM_NUMBER_LABEL}
                  labelInfo={<HTMLForm.RequiredSymbol />}
                  helperText={
                    <HTMLForm.NoteOrError
                      note={
                        isNew && values.manualNumber ? (
                          <>{FORM_NUMBER_NOTE_MANUAL}</>
                        ) : (
                          <>{FORM_NUMBER_NOTE_AUTO}</>
                        )
                      }
                      error={meta.touched && meta.error}
                    />
                  }
                >
                  <ControlGroup>
                    <InputGroup
                      disabled={
                        meta.submitting || (isNew && !values.manualNumber)
                      }
                      name={FIELD_NUMBER}
                      id={getFormFieldId(FIELD_NUMBER)}
                      value={input.value}
                      onChange={input.onChange}
                      autoFocus={!isNew}
                      className={Classes.FILL}
                      inputRef={numberRef}
                      rightElement={
                        isNew ? (
                          <Tooltip2
                            content={
                              values.manualNumber
                                ? 'генерировать автоматически'
                                : 'ввести вручную'
                            }
                          >
                            <Button
                              minimal
                              intent={Intent.PRIMARY}
                              onClick={() =>
                                form.change(
                                  FIELD_MANUAL_NUMBER,
                                  !values.manualNumber
                                )
                              }
                              icon={values.manualNumber ? 'unlock' : 'lock'}
                            />
                          </Tooltip2>
                        ) : undefined
                      }
                    />
                    {!isNew && (
                      <CopyNumberButton
                        number={input.value}
                        small={false}
                        minimal={false}
                      />
                    )}
                  </ControlGroup>
                </FormGroup>
              )}
            />
          )
        }}
      />

      <WhenFieldChanges
        field={FIELD_MANUAL_NUMBER}
        becomes={false}
        set={FIELD_NUMBER}
        to=""
      />

      <OperationMixedAgreements
        operation={operation}
        isNew={isNew}
        ref={mixedAgreementsRef}
      />

      <Field
        name={FIELD_CREATE_DATE}
        allowNull
        render={({ input, meta }) => (
          <FormGroup
            label={FORM_CREATE_DATE_LABEL}
            labelInfo={<HTMLForm.RequiredSymbol />}
            helperText={
              <HTMLForm.NoteOrError error={meta.touched && meta.error} />
            }
          >
            <DateInput
              disabled={meta.submitting}
              showActionsBar
              todayButtonText={'Сегодня'}
              clearButtonText={'Очистить'}
              maxDate={maxDate}
              onChange={handleChangeCreateDate}
              inputProps={{
                name: input.name,
                inputRef: createDateRef,
              }}
              timePrecision={TimePrecision.MINUTE}
              value={input.value ? moment(input.value).toDate() : null}
              formatDate={(date) => moment(date).format('DD.MM.YYYY HH:mm')}
              parseDate={(date) => moment(date, 'DD.MM.YYYY HH:mm').toDate()}
              popoverProps={{ wrapperTagName: 'div', targetTagName: 'div' }}
              ref={dateInputRef}
              dayPickerProps={{ localeUtils }}
            />
          </FormGroup>
        )}
      />
      <Field
        allowNull
        name={FIELD_WORKER}
        render={({ input, meta }) => {
          return (
            <FormGroup
              label={FORM_WORKER_LABEL}
              labelInfo={<HTMLForm.RequiredSymbol />}
              helperText={
                <HTMLForm.NoteOrError error={meta.touched && meta.error} />
              }
            >
              <EmployeeSelect
                value={input.value}
                disabled={meta.submitting}
                options={employees}
                onSelect={handleSelectWorker}
                isClearButtonShow={false}
                inputRef={workerInputRef}
                buttonRef={workerRef}
              />
            </FormGroup>
          )
        }}
      />
      <Field
        allowNull
        name={FIELD_CREATOR}
        render={({ input, meta }) => (
          <FormGroup
            label={FORM_CREATOR_LABEL}
            labelInfo={<HTMLForm.RequiredSymbol />}
            helperText={
              <HTMLForm.NoteOrError error={meta.touched && meta.error} />
            }
          >
            <EmployeeSelect
              value={input.value}
              disabled={meta.submitting}
              options={employees}
              onSelect={handleSelectCreator}
              isClearButtonShow={false}
              inputRef={creatorInputRef}
              buttonRef={creatorRef}
            />
          </FormGroup>
        )}
      />
      <Field
        name={FIELD_SUP_NUMBER}
        render={({ input, meta }) => (
          <FormGroup
            label={FORM_SUPPLIER_NUMBER_LABEL}
            helperText={
              <HTMLForm.NoteOrError error={meta.touched && meta.error} />
            }
          >
            <InputGroup
              type="text"
              onChange={(e) => form.change(FIELD_SUP_NUMBER, e.target.value)}
              value={input.value || ''}
              disabled={meta.submitting}
              rightElement={
                input.value && (
                  <Button
                    onClick={() => form.change(FIELD_SUP_NUMBER, null)}
                    icon={IconNames.CROSS}
                    minimal
                  />
                )
              }
              inputRef={supNumberRef}
            />
          </FormGroup>
        )}
      />
      <Field
        name={FIELD_SUP_SHIPMENT_DATE}
        allowNull
        render={({ input, meta }) => (
          <FormGroup
            label={FORM_SUPPLIER_DATE_LABEL}
            helperText={
              <HTMLForm.NoteOrError error={meta.touched && meta.error} />
            }
          >
            <DateInput
              disabled={meta.submitting}
              showActionsBar
              todayButtonText={'Сегодня'}
              clearButtonText={'Очистить'}
              maxDate={maxDate}
              onChange={handleChangeSupShipmentDate}
              inputProps={{
                name: input.name,
                rightElement: input.value && (
                  <Button
                    onClick={() => form.change(FIELD_SUP_SHIPMENT_DATE, null)}
                    icon={IconNames.CROSS}
                    minimal
                  />
                ),
                inputRef: supShipmentDateRef,
              }}
              timePrecision={TimePrecision.MINUTE}
              value={input.value ? moment(input.value).toDate() : null}
              formatDate={(date) => moment(date).format('DD.MM.YYYY HH:mm')}
              parseDate={(date) => moment(date, 'DD.MM.YYYY HH:mm').toDate()}
              popoverProps={{
                wrapperTagName: 'div',
                targetTagName: 'div',
              }}
              dayPickerProps={{ localeUtils }}
            />
          </FormGroup>
        )}
      />

      <FormSpy
        subscription={{
          values: true,
          pristine: true,
          submitting: true,
          submitError: true,
        }}
        render={({ pristine, submitting, submitError }) => (
          <>
            {submitError && (
              <ErrorAlert
                error={submitError}
                text={'Произошла ошибка при сохранении операции'}
              />
            )}
            <HTMLForm.Buttons>
              {isNew ? (
                <CreateOperationButton
                  loading={submitting}
                  disabled={submitting || (!isNew && pristine)}
                  elementRef={submitButtonRef}
                  onSubmit={form.submit}
                />
              ) : (
                <Button
                  intent={Intent.PRIMARY}
                  type="submit"
                  loading={submitting}
                  disabled={submitting || (!isNew && pristine)}
                  text={'Сохранить'}
                  elementRef={submitButtonRef}
                />
              )}
            </HTMLForm.Buttons>
          </>
        )}
      />
    </HTMLForm>
  )
}
