import { Investment, PriceHistory } from '../types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

interface PriceTrackerProps {
  investments: Investment[]
  priceHistory: PriceHistory[]
  btcPrice: number
}

export default function PriceTracker({ investments, priceHistory, btcPrice }: PriceTrackerProps) {
  // 计算平均成本
  const calculateAverageCost = () => {
    if (investments.length === 0) return 0
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const totalBTC = investments.reduce((sum, inv) => sum + inv.btcAmount, 0)
    return totalBTC > 0 ? totalInvested / totalBTC : 0
  }

  const averageCost = calculateAverageCost()
  const costDiff = btcPrice - averageCost
  const costDiffPercent = averageCost > 0 ? (costDiff / averageCost) * 100 : 0

  // 准备图表数据
  const chartData = priceHistory
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(ph => ({
      date: format(parseISO(ph.date), 'MM-dd'),
      price: ph.price,
      average: averageCost
    }))

  // 月度统计
  const monthlyStats = investments.reduce((acc, inv) => {
    const month = format(parseISO(inv.date), 'yyyy-MM')
    if (!acc[month]) {
      acc[month] = { amount: 0, btc: 0, count: 0 }
    }
    acc[month].amount += inv.amount
    acc[month].btc += inv.btcAmount
    acc[month].count += 1
    return acc
  }, {} as Record<string, { amount: number; btc: number; count: number }>)

  return (
    <div className="space-y-6">
      {/* 成本分析 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <div className="text-slate-400 text-sm mb-2">平均成本</div>
          <div className="text-2xl font-bold text-white">
            ${averageCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-2">基于已投资金额平均</div>
        </div>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <div className="text-slate-400 text-sm mb-2">当前价格</div>
          <div className="text-2xl font-bold text-yellow-500">
            ${btcPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-2">实时行情</div>
        </div>

        <div className={`rounded-lg border p-6 ${
          costDiff >= 0
            ? 'bg-green-900/20 border-green-700/50'
            : 'bg-red-900/20 border-red-700/50'
        }`}>
          <div className={`text-sm mb-2 ${costDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {costDiff >= 0 ? '超出成本' : '低于成本'}
          </div>
          <div className={`text-2xl font-bold ${costDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {costDiff >= 0 ? '+' : ''}${costDiff.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs mt-2 ${costDiff >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {costDiffPercent > 0 ? '+' : ''}{costDiffPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 价格趋势图 */}
      {chartData.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4">价格趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#eab308"
                dot={{ fill: '#eab308' }}
                name="BTC 价格"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#8b5cf6"
                strokeDasharray="5 5"
                name="平均成本"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 月度统计 */}
      {Object.keys(monthlyStats).length > 0 && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4">月度投资统计</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">月份</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">投资次数</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">投资金额</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">获得 BTC</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">平均单价</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(monthlyStats)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([month, stats]) => (
                    <tr key={month} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                      <td className="py-3 px-4 text-white">{month}</td>
                      <td className="text-right py-3 px-4 text-slate-300">{stats.count}</td>
                      <td className="text-right py-3 px-4 text-white font-medium">
                        ${stats.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="text-right py-3 px-4 text-yellow-500 font-medium">
                        {stats.btc.toFixed(8)}
                      </td>
                      <td className="text-right py-3 px-4 text-slate-300">
                        ${(stats.amount / stats.btc).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {investments.length === 0 && (
        <div className="col-span-full bg-slate-800/30 rounded-lg border border-slate-700/30 p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-slate-400 text-lg">暂无投资数据</p>
          <p className="text-slate-500 text-sm mt-2">添加投资记录后，这里将显示您的投资分析</p>
        </div>
      )}
    </div>
  )
}
