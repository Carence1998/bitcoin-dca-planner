export interface Investment {
  id: string
  amount: number
  price: number
  date: string
  btcAmount: number
}

export interface PriceHistory {
  date: string
  price: number
}

export interface Portfolio {
  totalInvested: number
  totalBTC: number
  currentValue: number
  profit: number
  profitRate: number
}
