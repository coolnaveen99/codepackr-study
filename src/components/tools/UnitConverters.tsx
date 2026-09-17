import React, { useState, useMemo } from 'react'
import { Scale, ArrowRightLeft, Binary, Flame, Gauge, Ruler, Weight, Compass, Zap } from 'lucide-react'
import { ToolHeader } from '../ui/ToolHeader'
import { FaqSection } from '../ui/FaqSection'
import { copyToClipboard } from '../../lib/utils'
import { TOOLS } from '../../data/tools'

type UnitCategory = 'length' | 'mass' | 'temp' | 'pressure' | 'energy' | 'speed' | 'angle' | 'data'

interface UnitDef {
  id: string
  name: string
  toBase: (val: number) => number
  fromBase: (val: number) => number
  symbol: string
}

const CATEGORIES_DATA: Record<UnitCategory, { label: string; icon: any; units: UnitDef[] }> = {
  length: {
    label: 'Length',
    icon: Ruler,
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ]
  },
  mass: {
    label: 'Mass & Weight',
    icon: Weight,
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: v => v * 0.02834952, fromBase: v => v / 0.02834952 },
      { id: 'ton', name: 'Metric Ton', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
    ]
  },
  temp: {
    label: 'Temperature',
    icon: Flame,
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * (9 / 5)) + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  pressure: {
    label: 'Pressure',
    icon: Gauge,
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: v => v, fromBase: v => v },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: v => v * 100000, fromBase: v => v / 100000 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', toBase: v => v * 101325, fromBase: v => v / 101325 },
      { id: 'psi', name: 'PSI (lb/in²)', symbol: 'psi', toBase: v => v * 6894.757, fromBase: v => v / 6894.757 },
      { id: 'mmhg', name: 'Torr / mmHg', symbol: 'mmHg', toBase: v => v * 133.322, fromBase: v => v / 133.322 },
    ]
  },
  energy: {
    label: 'Energy & Work',
    icon: Zap,
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', toBase: v => v, fromBase: v => v },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cal', name: 'Gram Calorie', symbol: 'cal', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { id: 'kcal', name: 'Kilocalorie (Food cal)', symbol: 'kcal', toBase: v => v * 4184, fromBase: v => v / 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'ev', name: 'Electron-Volt', symbol: 'eV', toBase: v => v * 1.602176634e-19, fromBase: v => v / 1.602176634e-19 },
    ]
  },
  speed: {
    label: 'Speed',
    icon: Scale,
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', toBase: v => v, fromBase: v => v },
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ]
  },
  angle: {
    label: 'Angle',
    icon: Compass,
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', toBase: v => v, fromBase: v => v },
      { id: 'rad', name: 'Radian', symbol: 'rad', toBase: v => v * (180 / Math.PI), fromBase: v => v * (Math.PI / 180) },
      { id: 'grad', name: 'Gradian', symbol: 'grad', toBase: v => v * 0.9, fromBase: v => v / 0.9 },
    ]
  },
  data: {
    label: 'Data Storage',
    icon: Binary,
    units: [
      { id: 'b', name: 'Byte', symbol: 'B', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
    ]
  }
}

export const UnitConverters: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const toolDef = TOOLS.find(t => t.id === 'unit-converters')!
  const [category, setCategory] = useState<UnitCategory>('length')
  const [inputValue, setInputValue] = useState<string>('100')
  const [fromUnitId, setFromUnitId] = useState<string>('m')
  const [toUnitId, setToUnitId] = useState<string>('ft')
  const [copied, setCopied] = useState(false)

  const currentCatData = CATEGORIES_DATA[category]
  const units = currentCatData.units

  const fromUnit = units.find(u => u.id === fromUnitId) || units[0]
  const toUnit = units.find(u => u.id === toUnitId) || units[1]

  const convertedValue = useMemo(() => {
    const val = parseFloat(inputValue)
    if (isNaN(val)) return '0'
    const base = fromUnit.toBase(val)
    const result = toUnit.fromBase(base)

    if (Math.abs(result) < 0.0001 && result !== 0) {
      return result.toExponential(4)
    }
    if (Math.abs(result) >= 1e9) {
      return result.toExponential(4)
    }
    return Number(result.toFixed(6)).toString()
  }, [inputValue, fromUnit, toUnit])

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat)
    const newUnits = CATEGORIES_DATA[newCat].units
    setFromUnitId(newUnits[0].id)
    setToUnitId(newUnits[1]?.id || newUnits[0].id)
    setInputValue('1')
  }

  const handleSwap = () => {
    setFromUnitId(toUnitId)
    setToUnitId(fromUnitId)
  }

  const handleLoadSample = () => {
    setCategory('temp')
    setFromUnitId('c')
    setToUnitId('f')
    setInputValue('37') // Normal body temp
  }

  const handleReset = () => {
    setInputValue('0')
  }

  const handleCopy = async () => {
    const text = `${inputValue} ${fromUnit.symbol} = ${convertedValue} ${toUnit.symbol}\n(Codepackr Study Unit Converter)`
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <ToolHeader
        title={toolDef.name}
        description={toolDef.description}
        badge={toolDef.badge}
        categoryName="Science & Converters"
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onCopyResult={handleCopy}
        isCopied={copied}
        onBack={onBack}
      />

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
        {Object.entries(CATEGORIES_DATA).map(([catKey, catVal]) => {
          const IconComponent = catVal.icon
          const isSelected = category === catKey
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey as UnitCategory)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{catVal.label}</span>
            </button>
          )
        })}
      </div>

      {/* Converter Card */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4">
          {/* FROM side (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-500">
              From Unit
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full px-3.5 py-2.5 text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={fromUnitId}
              onChange={e => setFromUnitId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* SWAP button (1 col) */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition cursor-pointer shadow-sm"
              title="Swap Units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO side (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-500">
              To Unit (Result)
            </label>
            <div className="w-full px-3.5 py-2.5 text-lg font-bold rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 text-slate-900 dark:text-white truncate">
              {convertedValue}
            </div>
            <select
              value={toUnitId}
              onChange={e => setToUnitId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Calculation formula summary */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Equation:{' '}
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {inputValue} {fromUnit.symbol} = {convertedValue} {toUnit.symbol}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Standard scientific conversion factors applied
          </div>
        </div>
      </div>

      <FaqSection faqs={toolDef.faqs} />
    </div>
  )
}
