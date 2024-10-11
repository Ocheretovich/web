import type { FlexProps, StackProps } from '@chakra-ui/react'
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text as CText,
} from '@chakra-ui/react'
import {
  foxOnArbitrumOneAssetId,
  fromAccountId,
  fromAssetId,
  thorchainAssetId,
} from '@shapeshiftoss/caip'
import { useCallback, useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { useHistory } from 'react-router'
import { Amount } from 'components/Amount/Amount'
import { RFOXIcon } from 'components/Icons/RFOX'
import { Text } from 'components/Text'
import { useFeatureFlag } from 'hooks/useFeatureFlag/useFeatureFlag'
import { bn } from 'lib/bignumber/bignumber'
import { fromBaseUnit } from 'lib/math'
import { formatSecondsToDuration } from 'lib/utils/time'
import { selectStakingBalance } from 'pages/RFOX/helpers'
import { useAffiliateRevenueQuery } from 'pages/RFOX/hooks/useAffiliateRevenueQuery'
import { useCurrentApyQuery } from 'pages/RFOX/hooks/useCurrentApyQuery'
import { useCurrentEpochMetadataQuery } from 'pages/RFOX/hooks/useCurrentEpochMetadataQuery'
import { useCurrentEpochRewardsQuery } from 'pages/RFOX/hooks/useCurrentEpochRewardsQuery'
import { useLifetimeRewardsQuery } from 'pages/RFOX/hooks/useLifetimeRewardsQuery'
import { useStakingInfoQuery } from 'pages/RFOX/hooks/useStakingInfoQuery'
import { useTimeInPoolQuery } from 'pages/RFOX/hooks/useTimeInPoolQuery'
import {
  selectAccountIdByAccountNumberAndChainId,
  selectAssetById,
  selectMarketDataByAssetIdUserCurrency,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { useFoxPageContext } from '../hooks/useFoxPageContext'
import { RFOXSimulator } from './RFOXSimulator'

const containerPaddingX = { base: 4, xl: 0 }
const columnsProps = {
  base: 1,
  md: 2,
}
const stackProps: StackProps = {
  width: '100%',
  flexDir: 'column',
  flex: 1,
  spacing: 0,
}

const headerSx: FlexProps['sx'] = {
  alignItems: { base: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  mb: 8,
  flexDir: {
    base: 'column',
    md: 'row',
  },
}

const headerTitleMb = { base: 4, md: 0 }
const rfoxIconStyles = {
  path: {
    fill: 'url(#rfoxGradient)',
  },
}

export const RFOXSection = () => {
  const translate = useTranslate()
  const history = useHistory()
  const isRFOXEnabled = useFeatureFlag('FoxPageRFOX')
  const { assetAccountId, assetAccountNumber } = useFoxPageContext()

  const runeAsset = useAppSelector(state => selectAssetById(state, thorchainAssetId))

  const apyQuery = useCurrentApyQuery()

  const handleManageClick = useCallback(() => {
    history.push('/rfox')
  }, [history])

  const accountIdsByAccountNumberAndChainId = useAppSelector(
    selectAccountIdByAccountNumberAndChainId,
  )

  const stakingAsset = useAppSelector(state => selectAssetById(state, foxOnArbitrumOneAssetId))
  const runeAssetMarketData = useAppSelector(state =>
    selectMarketDataByAssetIdUserCurrency(state, thorchainAssetId),
  )

  const filter = useMemo(
    () =>
      assetAccountId ? { assetId: foxOnArbitrumOneAssetId, accountId: assetAccountId } : undefined,
    [assetAccountId],
  )

  const rfoxAssetAccountId = useMemo(() => {
    if (!(filter && assetAccountNumber !== undefined)) return
    const accountNumberAccountIds = accountIdsByAccountNumberAndChainId[assetAccountNumber]
    const matchingAccountId =
      accountNumberAccountIds?.[fromAssetId(foxOnArbitrumOneAssetId).chainId]
    return matchingAccountId
  }, [accountIdsByAccountNumberAndChainId, filter, assetAccountNumber])

  const stakingAssetAccountAddress = useMemo(
    () => (rfoxAssetAccountId ? fromAccountId(rfoxAssetAccountId).account : undefined),
    [rfoxAssetAccountId],
  )

  const stakingBalanceCryptoBaseUnitResult = useStakingInfoQuery({
    stakingAssetAccountAddress,
    select: selectStakingBalance,
  })

  const stakingBalanceCryptoBaseUnitLoading = useMemo(() => {
    return (
      stakingBalanceCryptoBaseUnitResult.isLoading || stakingBalanceCryptoBaseUnitResult.isFetching
    )
  }, [stakingBalanceCryptoBaseUnitResult])

  const stakingBalanceCryptoPrecision = useMemo(() => {
    if (!(stakingBalanceCryptoBaseUnitResult.data && stakingAsset)) return
    return fromBaseUnit(stakingBalanceCryptoBaseUnitResult.data, stakingAsset.precision)
  }, [stakingAsset, stakingBalanceCryptoBaseUnitResult.data])

  const currentEpochMetadataResult = useCurrentEpochMetadataQuery()

  const currentEpochRewardsCryptoBaseUnitResult = useCurrentEpochRewardsQuery({
    stakingAssetAccountAddress,
    currentEpochMetadata: currentEpochMetadataResult.data,
  })

  const lifetimeRewardsCryptoBaseUnitResult = useLifetimeRewardsQuery({
    stakingAssetAccountAddress,
  })

  const timeInPoolHumanResult = useTimeInPoolQuery({
    stakingAssetAccountAddress,
    select: timeInPoolSeconds =>
      timeInPoolSeconds === 0n ? 'N/A' : formatSecondsToDuration(Number(timeInPoolSeconds)),
  })

  const affiliateRevenueResult = useAffiliateRevenueQuery<string>({
    startTimestamp: currentEpochMetadataResult.data?.epochStartTimestamp,
    endTimestamp: currentEpochMetadataResult.data?.epochEndTimestamp,
    select: (totalRevenue: bigint) => {
      return bn(fromBaseUnit(totalRevenue.toString(), runeAsset?.precision ?? 0))
        .times(runeAssetMarketData.price)
        .toFixed(2)
    },
  })

  const burn = useMemo(() => {
    if (!affiliateRevenueResult.data) return
    if (!currentEpochMetadataResult.data) return

    return bn(affiliateRevenueResult.data)
      .times(currentEpochMetadataResult.data.burnRate)
      .toFixed(2)
  }, [affiliateRevenueResult.data, currentEpochMetadataResult.data])

  if (!stakingAsset) return null

  if (!isRFOXEnabled) return null

  return (
    <>
      <Divider mt={2} mb={6} />
      <Box py={4} px={containerPaddingX}>
        <Flex sx={headerSx}>
          <Box mb={headerTitleMb}>
            <Heading as='h2' fontSize='2xl' display='flex' alignItems='center'>
              <RFOXIcon me={2} boxSize='32px' sx={rfoxIconStyles} />
              {translate('foxPage.rfox.title')}
              <Tag colorScheme='green' verticalAlign='middle' ml={2}>
                <Amount.Percent value={apyQuery.data ?? 0} suffix='APY' />
              </Tag>
            </Heading>
            <Text fontSize='md' color='text.subtle' mt={2} translation='foxPage.rfox.whatIs' />
          </Box>

          <Card>
            <CardBody py={4} px={4}>
              <Text fontSize='md' color='text.subtle' translation='RFOX.pendingRewardsBalance' />

              <Skeleton
                isLoaded={
                  !Boolean(
                    currentEpochRewardsCryptoBaseUnitResult.isLoading ||
                      currentEpochRewardsCryptoBaseUnitResult.isFetching,
                  )
                }
              >
                <Amount.Crypto
                  value={fromBaseUnit(
                    currentEpochRewardsCryptoBaseUnitResult.data?.toString(),
                    runeAsset?.precision ?? 0,
                  )}
                  symbol={runeAsset?.symbol ?? ''}
                />
              </Skeleton>
            </CardBody>
          </Card>
        </Flex>

        <SimpleGrid my={4} columns={columnsProps} spacing='26px' width='100%' mb={8}>
          <Stack {...stackProps} alignItems='center' flexDir='row' justifyContent='space-between'>
            <Box>
              <Text
                fontSize='md'
                color='text.subtle'
                fontWeight='medium'
                translation='defi.stakingBalance'
                mb={1}
              />
              <Skeleton isLoaded={!stakingBalanceCryptoBaseUnitLoading}>
                <Amount.Crypto
                  fontSize='2xl'
                  value={stakingBalanceCryptoPrecision}
                  symbol={stakingAsset?.symbol ?? ''}
                />
              </Skeleton>
            </Box>
            <Button onClick={handleManageClick} colorScheme='gray' size='sm'>
              {translate('common.manage')}
            </Button>
          </Stack>

          <Stack {...stackProps}>
            <Text
              fontSize='md'
              color='text.subtle'
              fontWeight='medium'
              translation='RFOX.lifetimeRewards'
              mb={1}
            />
            <Skeleton
              isLoaded={
                !Boolean(
                  lifetimeRewardsCryptoBaseUnitResult.isLoading ||
                    lifetimeRewardsCryptoBaseUnitResult.isFetching,
                )
              }
            >
              <Amount.Crypto
                fontSize='2xl'
                value={fromBaseUnit(
                  lifetimeRewardsCryptoBaseUnitResult.data?.toString(),
                  runeAsset?.precision ?? 0,
                )}
                symbol={runeAsset?.symbol ?? ''}
              />
            </Skeleton>
          </Stack>

          <Stack {...stackProps}>
            <Text
              fontSize='md'
              color='text.subtle'
              fontWeight='medium'
              translation='RFOX.timeInPool'
              mb={1}
            />
            <Skeleton
              isLoaded={
                !Boolean(timeInPoolHumanResult.isLoading || timeInPoolHumanResult.isFetching)
              }
            >
              <CText fontSize='2xl'>{timeInPoolHumanResult.data ?? 'N/A'}</CText>
            </Skeleton>
          </Stack>

          <Stack {...stackProps}>
            <Text
              fontSize='md'
              color='text.subtle'
              fontWeight='medium'
              translation='foxPage.rfox.totalFoxBurn'
              mb={1}
            />
            <Skeleton isLoaded={Boolean(burn)}>
              <Amount.Fiat fontSize='2xl' value={burn} suffix='🔥 _ 🔥' />
            </Skeleton>
          </Stack>
        </SimpleGrid>
        <RFOXSimulator />
      </Box>
    </>
  )
}
