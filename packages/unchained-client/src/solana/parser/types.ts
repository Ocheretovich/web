import type * as solana from '../../generated/solana'
import type { BaseTxMetadata, StandardTx } from '../../types'

export * from '../../generated/solana'

export type Tx = solana.Tx

export interface ParsedTx extends StandardTx {
  data?: BaseTxMetadata
}

export type TxSpecific = Partial<Pick<ParsedTx, 'data' | 'trade' | 'transfers'>>

export interface SubParser<T extends Tx, U = TxSpecific> {
  parse(tx: T, address: string): Promise<U | undefined>
}
