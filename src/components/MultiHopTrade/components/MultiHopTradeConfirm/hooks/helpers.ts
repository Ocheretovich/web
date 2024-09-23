import type { HDWallet } from '@shapeshiftoss/hdwallet-core'
import type { TradeQuote, TradeQuoteStep } from '@shapeshiftoss/swapper'
import { ZRC_PERMIT2_SOURCE_ID } from '@shapeshiftoss/swapper/dist/swappers/ZrxSwapper/utils/constants'
import { type AllowanceType, getApprovalAmountCryptoBaseUnit } from 'hooks/queries/useApprovalFees'
import { approve } from 'lib/utils/evm/approve'

export const approveTrade = async ({
  tradeQuoteStep,
  wallet,
  allowanceType,
  from,
}: {
  tradeQuoteStep: TradeQuote['steps'][number]
  wallet: HDWallet
  from: string
  allowanceType: AllowanceType
}): Promise<string> => {
  const txHash = await approve({
    assetId: tradeQuoteStep.sellAsset.assetId,
    accountNumber: tradeQuoteStep.accountNumber,
    from,
    amountCryptoBaseUnit: getApprovalAmountCryptoBaseUnit(
      tradeQuoteStep.sellAmountIncludingProtocolFeesCryptoBaseUnit,
      allowanceType,
    ),
    spender: tradeQuoteStep.allowanceContract,
    wallet,
  })

  return txHash
}

export const isPermit2Hop = (tradeQuoteStep: TradeQuoteStep | undefined) =>
  tradeQuoteStep?.source === ZRC_PERMIT2_SOURCE_ID
