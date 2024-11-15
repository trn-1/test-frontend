import React, { useState, useEffect, forwardRef, ForwardedRef } from 'react'

import ContractorsApi from 'core/api/contractors'
import logger from 'core/common/logger'
import {
  MixedAgreementsField,
  MixedAgreementsSelectField,
} from 'core/components/form-fields'
import { MixedAgreement } from 'core/models/agreement'
import { ContractorTypes } from 'core/models/contractor'
import { TGROperation } from 'core/models/goods-receipt/operation'
import { GR_STATUS_NEW } from 'core/models/goods-receipt/statuses'

import {
  FIELD_MIXED_AGREEMENT,
  FORM_AGREEMENT_LABEL,
  FORM_SUPPLIER_LABEL,
} from '../constants'

interface IOperationMixedAgreementsProps {
  operation: Partial<TGROperation>
  isNew: boolean
}

export const OperationMixedAgreements = forwardRef(
  (
    { operation, isNew }: IOperationMixedAgreementsProps,
    ref: ForwardedRef<HTMLInputElement | HTMLButtonElement>
  ) => {
    const [mixedAgreements, setMixedAgreements] = useState<MixedAgreement[]>([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
      const fetchInitialMixedAgreement = async () => {
        try {
          setLoading(true)

          const { data } = await ContractorsApi.getMixedAgreements()

          const results = Array.isArray(data) ? data : []

          setMixedAgreements(results)
        } catch (error) {
          logger.error(error)
        } finally {
          setLoading(false)
        }
      }

      if (!isNew) {
        fetchInitialMixedAgreement()
      }
    }, [isNew])

    return isNew ? (
      <MixedAgreementsField
        name={FIELD_MIXED_AGREEMENT}
        label={FORM_SUPPLIER_LABEL}
        required
        inputProps={{
          isClearButtonShow: false,
          autoFocus: true,
          contractorType: ContractorTypes.SUPPLIER,
          loadImmediately: true,
          minQueryLength: 0,
          inputRef: ref as ForwardedRef<HTMLInputElement>,
        }}
      />
    ) : (
      <MixedAgreementsSelectField
        name={FIELD_MIXED_AGREEMENT}
        label={FORM_AGREEMENT_LABEL}
        required
        contractorId={operation.supplier?.id}
        disabled={operation.status !== GR_STATUS_NEW}
        contractorType={ContractorTypes.SUPPLIER}
        inputProps={{
          isClearButtonShow: false,
          loading: isLoading,
        }}
        elementRef={ref as ForwardedRef<HTMLButtonElement>}
        options={mixedAgreements}
      />
    )
  }
)
