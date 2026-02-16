import { Investment } from '../types'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface InvestmentRecordsProps {
  investments: Investment[]
  onDelete: (id: string) => void
  currentPrice: number
}

export default function InvestmentRecords({
  investments,
  onDelete,
  currentPrice
}: InvestmentRecordsProps) {
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      onDelete(id)
    }
  }

  const sortedInvestments = [...investments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
      <h2 className="text-xl font-bold text-white mb-6">投资记录</h2>

      {investments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-slate-400 text-lg">暂无投资记录</p>
          <p className="text-slate-500 text-sm mt-2">从定投计算器添加您的第一笔投资</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-slate-400 font-medium">日期</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">投资金额</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">买入价格</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">获得 BTC</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">当前价值</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">收益</th>
                <th className="text-center py-4 px-4 text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvestments.map((inv) => {
                const currentValue = inv.btcAmount * currentPrice
                const profit = currentValue - inv.amount
                const profitRate = (profit / inv.amount) * 100

                return (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-4 px-4 text-white">
                      <div>{format(parseISO(inv.date), 'yyyy-MM-dd')}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {format(parseISO(inv.date), 'EEEE', { locale: zhCN })}
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-white font-medium">
                      ${inv.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-4 px-4 text-slate-300">
                      ${inv.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-4 px-4 text-yellow-500 font-medium">
                      {inv.btcAmount.toFixed(8)}
                    </td>
                    <td className="text-right py-4 px-4 text-white font-medium">
                      ${currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`text-right py-4 px-4 font-medium ${
                      profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <div>{profit >= 0 ? '+' : ''}${profit.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                      <div className="text-xs mt-1">{profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-sm transition-colors border border-red-600/30"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* 统计信息 */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-slate-400 text-sm">总记录数</div>
                <div className="text-2xl font-bold text-white">{investments.length}</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">总投入</div>
                <div className="text-2xl font-bold text-white">
                  ${investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">累计 BTC</div>
                <div className="text-2xl font-bold text-yellow-500">
                  {investments.reduce((sum, inv) => sum + inv.btcAmount, 0).toFixed(8)}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">平均买入价</div>
                <div className="text-2xl font-bold text-slate-300">
                  ${investments.length > 0
                    ? (investments.reduce((sum, inv) => sum + inv.amount, 0) / investments.reduce((sum, inv) => sum + inv.btcAmount, 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })
                    : '0'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
