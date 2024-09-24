import type { HDWallet } from '@shapeshiftoss/hdwallet-core'
import { SwapperName, type TradeQuote, type TradeQuoteStep } from '@shapeshiftoss/swapper'
import { getConfig } from 'config'
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

export const isPermit2Hop = (tradeQuoteStep: TradeQuoteStep | undefined) => {
  const isPermit2Enabled = getConfig().REACT_APP_FEATURE_ZRX_PERMIT2
  return isPermit2Enabled && tradeQuoteStep?.source === SwapperName.Zrx
}
