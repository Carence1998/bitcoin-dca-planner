import { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import Portfolio from './components/Portfolio'
import PriceTracker from './components/PriceTracker'
import InvestmentRecords from './components/InvestmentRecords'
import { Investment, PriceHistory } from './types'
import { loadFromStorage, saveToStorage } from './utils/storage'

export default function App() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [btcPrice, setBtcPrice] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'calculator' | 'portfolio' | 'records'>('calculator')

  // 初始化数据
  useEffect(() => {
    const savedInvestments = loadFromStorage('investments', [])
    const savedPriceHistory = loadFromStorage('priceHistory', [])
    setInvestments(savedInvestments)
    setPriceHistory(savedPriceHistory)
    
    // 模拟获取当前 BTC 价格
    fetchBTCPrice()
  }, [])

  // 保存投资数据
  useEffect(() => {
    saveToStorage('investments', investments)
  }, [investments])

  // 保存价格历史
  useEffect(() => {
    saveToStorage('priceHistory', priceHistory)
  }, [priceHistory])

  const fetchBTCPrice = async () => {
    try {
      // 使用 CoinGecko 免费 API
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cny'
      )
      const data = await response.json()
      const usdPrice = data.bitcoin?.usd || 0
      setBtcPrice(usdPrice)
    } catch (error) {
      console.error('获取比特币价格失败:', error)
      // 如果 API 失败，使用默认价格
      setBtcPrice(42500)
    }
  }

  const addInvestment = (amount: number, price: number, date: string) => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      amount,
      price,
      date,
      btcAmount: amount / price
    }
    setInvestments([...investments, newInvestment])
    
    // 添加价格历史
    addPriceHistory(price, date)
  }

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id))
  }

  const addPriceHistory = (price: number, date: string) => {
    const existing = priceHistory.find(p => p.date === date)
    if (!existing) {
      setPriceHistory([...priceHistory, { date, price }])
    }
  }

  const calculatePortfolio = () => {
    let totalInvested = 0
    let totalBTC = 0
    
    investments.forEach(inv => {
      totalInvested += inv.amount
      totalBTC += inv.btcAmount
    })

    const currentValue = totalBTC * btcPrice
    const profit = currentValue - totalInvested
    const profitRate = totalInvested > 0 ? (profit / totalInvested) * 100 : 0

    return {
      totalInvested,
      totalBTC,
      currentValue,
      profit,
      profitRate
    }
  }

  const portfolio = calculatePortfolio()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">₿</div>
              <h1 className="text-2xl font-bold text-white">比特币定投计划</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">当前 BTC 价格</div>
              <div className="text-2xl font-bold text-yellow-500">
                ${btcPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        {investments.length > 0 && (
          <div className="mb-8">
            <Portfolio portfolio={portfolio} />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'calculator'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            定投计算器
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            投资分析
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'records'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            投资记录
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'calculator' && (
            <Calculator onAddInvestment={addInvestment} currentPrice={btcPrice} />
          )}
          {activeTab === 'portfolio' && (
            <PriceTracker investments={investments} priceHistory={priceHistory} btcPrice={btcPrice} />
          )}
          {activeTab === 'records' && (
            <InvestmentRecords 
              investments={investments} 
              onDelete={deleteInvestment}
              currentPrice={btcPrice}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400 text-sm">
          <p>💡 提示：本网站仅供参考，不构成投资建议。投资有风险，请谨慎决策。</p>
          <p className="mt-2">数据来源：CoinGecko API | 本地存储数据</p>
        </div>
      </footer>
    </div>
  )
}
