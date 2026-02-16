import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface CalculatorProps {
  onAddInvestment: (amount: number, price: number, date: string) => void
  currentPrice: number
}

export default function Calculator({ onAddInvestment, currentPrice }: CalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>('500')
  const [investmentPrice, setInvestmentPrice] = useState<string>(currentPrice.toString())
  const [investmentDate, setInvestmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [btcAmount, setBtcAmount] = useState<number>(0)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInvestmentAmount(value)
    calculateBTC(parseFloat(value), parseFloat(investmentPrice))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInvestmentPrice(value)
    calculateBTC(parseFloat(investmentAmount), parseFloat(value))
  }

  const calculateBTC = (amount: number, price: number) => {
    if (amount > 0 && price > 0) {
      setBtcAmount(amount / price)
    } else {
      setBtcAmount(0)
    }
  }

  const handleUseCurrentPrice = () => {
    setInvestmentPrice(currentPrice.toString())
    calculateBTC(parseFloat(investmentAmount), currentPrice)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(investmentAmount)
    const price = parseFloat(investmentPrice)
    
    if (amount <= 0 || price <= 0) {
      alert('请输入有效的金额和价格')
      return
    }

    onAddInvestment(amount, price, investmentDate)
    
    // 重置表单
    setInvestmentAmount('500')
    setInvestmentPrice(currentPrice.toString())
    setInvestmentDate(new Date().toISOString().split('T')[0])
    setBtcAmount(0)

    // 显示成功提示
    alert(`✅ 已添加定投记录：$${amount.toLocaleString()} @ $${price.toLocaleString()}`)
  }

  const displayDate = investmentDate 
    ? format(parseISO(investmentDate), 'yyyy年M月d日 EEEE', { locale: zhCN })
    : ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-6">添加定投记录</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 投资日期 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                投资日期
              </label>
              <input
                type="date"
                value={investmentDate}
                onChange={(e) => setInvestmentDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              {displayDate && (
                <p className="mt-1 text-xs text-slate-400">{displayDate}</p>
              )}
            </div>

            {/* 投资金额 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                投资金额 (USD)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={handleAmountChange}
                  placeholder="输入 USD 金额"
                  className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => { setInvestmentAmount('500'); calculateBTC(500, parseFloat(investmentPrice)); }}
                  className="px-3 py-2 bg-slate-600/50 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
                >
                  $500
                </button>
                <button
                  type="button"
                  onClick={() => { setInvestmentAmount('1000'); calculateBTC(1000, parseFloat(investmentPrice)); }}
                  className="px-3 py-2 bg-slate-600/50 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
                >
                  $1000
                </button>
              </div>
            </div>

            {/* BTC 价格 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                BTC 买入价格 (USD)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={investmentPrice}
                  onChange={handlePriceChange}
                  placeholder="输入 BTC 买入价格"
                  className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentPrice}
                  className="px-4 py-2 bg-yellow-600/50 hover:bg-yellow-600 rounded-lg text-white text-sm transition-colors font-medium"
                >
                  用当前价格
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">当前价格: ${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>

            {/* 计算结果 */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">获得 BTC 数量：</span>
                <span className="text-2xl font-bold text-yellow-500">
                  {btcAmount.toFixed(8)} BTC
                </span>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>添加记录</span>
            </button>
          </form>
        </div>
      </div>

      {/* Help Panel */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 h-full">
          <h3 className="text-lg font-bold text-white mb-4">📚 使用指南</h3>
          
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-white mb-1">💡 什么是定投？</h4>
              <p>定期定额投资，按照既定计划在指定时间间隔内，投入一定的金额购买比特币。</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-1">🎯 定投优势</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>分散成本风险</li>
                <li>避免择时困难</li>
                <li>适合长期投资</li>
                <li>养成投资习惯</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-1">⚙️ 如何使用</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>输入投资金额</li>
                <li>输入 BTC 买入价格</li>
                <li>选择投资日期</li>
                <li>点击"添加记录"</li>
              </ol>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3">
              <p className="text-yellow-300 text-xs">⚠️ 声明：本网站仅供学习参考，不构成投资建议。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
