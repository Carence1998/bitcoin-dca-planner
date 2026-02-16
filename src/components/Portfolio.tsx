interface PortfolioProps {
  portfolio: {
    totalInvested: number
    totalBTC: number
    currentValue: number
    profit: number
    profitRate: number
  }
}

export default function Portfolio({ portfolio }: PortfolioProps) {
  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-400'
    if (profit < 0) return 'text-red-400'
    return 'text-slate-400'
  }

  const getProfitRateColor = (rate: number) => {
    if (rate > 0) return 'bg-green-900/30 border-green-700/50 text-green-300'
    if (rate < 0) return 'bg-red-900/30 border-red-700/50 text-red-300'
    return 'bg-slate-700/30 border-slate-600/50 text-slate-300'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 总投入 */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
        <div className="text-slate-400 text-sm mb-1">总投入</div>
        <div className="text-2xl font-bold text-white">
          ${portfolio.totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 持有 BTC */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
        <div className="text-slate-400 text-sm mb-1">持有 BTC</div>
        <div className="text-2xl font-bold text-yellow-500">
          {portfolio.totalBTC.toFixed(8)} BTC
        </div>
      </div>

      {/* 当前价值 */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
        <div className="text-slate-400 text-sm mb-1">当前价值</div>
        <div className="text-2xl font-bold text-white">
          ${portfolio.currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 绝对收益 */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
        <div className="text-slate-400 text-sm mb-1">绝对收益</div>
        <div className={`text-2xl font-bold ${getProfitColor(portfolio.profit)}`}>
          {portfolio.profit > 0 ? '+' : ''}${portfolio.profit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 收益率 */}
      <div className={`rounded-lg border p-4 ${getProfitRateColor(portfolio.profitRate)}`}>
        <div className="text-sm mb-1 opacity-75">收益率</div>
        <div className="text-2xl font-bold">
          {portfolio.profitRate > 0 ? '+' : ''}{portfolio.profitRate.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
