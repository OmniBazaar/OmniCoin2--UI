export function getAmountAvailable(vestingBalance, forceAll) {
  const balance = vestingBalance.balance.amount,
    earned = vestingBalance.policy[1].coin_seconds_earned,
    vestingPeriod = vestingBalance.policy[1].vesting_seconds,
    availablePercent =
      (forceAll || vestingPeriod) === 0
        ? 1
        : earned / (vestingPeriod * balance);
  return Math.floor(balance * availablePercent);
}
