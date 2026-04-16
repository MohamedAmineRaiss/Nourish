'use client';

import { useState, useEffect, useCallback } from 'react';
import { FoodItem, StockItem, Locale } from '@/types';
import { t } from '@/lib/i18n';
import Card from '@/components/Card';
import Btn from '@/components/Btn';

type StockManagerProps = {
  locale: Locale;
  deviceId: string;
};

export default function StockManager({ locale, deviceId }: StockManagerProps) {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [lowStock, setLowStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addGrams, setAddGrams] = useState('500');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch(`/api/stock?device_id=${deviceId}`);
      const data = await res.json();
      setStock(data.stock || []);
      setLowStock(data.lowStock || []);
    } catch { }
    setLoading(false);
  }, [deviceId]);

  useEffect(() => { fetchStock(); }, [fetchStock]);

  // Search foods to add to stock
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(searchQuery)}&lang=${locale}`);
        const data = await res.json();
        // Filter out items already in stock
        const stockIds = new Set(stock.map(s => s.food_id));
        setSearchResults((data.foods || []).filter((f: FoodItem) => !stockIds.has(f.id)));
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, locale, stock]);

  const addToStock = async (food: FoodItem) => {
    const grams = Math.max(0, parseInt(addGrams) || 500);
    await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: deviceId,
        food_id: food.id,
        food_label: food.label,
        quantity_grams: grams,
        category: food.category,
      }),
    });
    setSearchQuery('');
    setSearchResults([]);
    setAddingId(null);
    setAddGrams('500');
    fetchStock();
  };

  const updateStock = async (item: StockItem, newGrams: number) => {
    await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: deviceId,
        food_id: item.food_id,
        food_label: item.food_label,
        quantity_grams: Math.max(0, newGrams),
        category: item.category,
      }),
    });
    setEditingId(null);
    fetchStock();
  };

  const deleteStock = async (foodId: string) => {
    await fetch(`/api/stock?device_id=${deviceId}&food_id=${foodId}`, { method: 'DELETE' });
    fetchStock();
  };

  const pctLeft = (item: StockItem) =>
    item.initial_grams > 0 ? Math.round((item.quantity_grams / item.initial_grams) * 100) : 100;

  if (loading) return <div className="text-center py-8"><div className="w-6 h-6 border-2 border-terra-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="flex flex-col gap-4 animate-page">
      <h2 className="font-display text-[22px] text-bark-500 dark:text-cream-100">
        {t('stock.title', locale)}
      </h2>
      <p className="font-body text-[13px] text-bark-200 dark:text-bark-100 -mt-2">
        {t('stock.subtitle', locale)}
      </p>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <Card highlight>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-2">
            ⚠️ {t('stock.lowAlert', locale)}
          </h3>
          {lowStock.map(item => (
            <div key={item.food_id} className="font-body text-sm text-bark-500 dark:text-cream-200 py-1">
              {item.food_label} — <span className="text-terra-500 font-bold">{Math.round(item.quantity_grams)}g {t('stock.left', locale)}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Search to add */}
      <div className="relative">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 ${t('stock.searchAdd', locale)}`}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-cream-300 dark:border-bark-400 bg-cream-50 dark:bg-bark-600 font-body text-[15px] text-bark-500 dark:text-cream-200 outline-none transition-colors focus:border-terra-500 placeholder:text-bark-100"
          type="search"
          autoComplete="off"
        />

        {searchResults.length > 0 && (
          <div className="absolute top-full inset-x-0 z-10 mt-1.5 bg-white dark:bg-bark-600 rounded-2xl shadow-xl border border-cream-300 dark:border-bark-400 max-h-[250px] overflow-y-auto">
            {searchResults.map((food) => (
              <div key={food.id}>
                {addingId === food.id ? (
                  <div className="px-4 py-3 flex items-center gap-2 border-b border-cream-300/50 dark:border-bark-400/50">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={addGrams}
                      onChange={(e) => setAddGrams(e.target.value)}
                      className="w-20 px-2 py-1 rounded-lg border-2 border-terra-500 bg-cream-50 dark:bg-bark-600 font-body text-sm text-center"
                      autoFocus
                    />
                    <span className="font-body text-xs text-bark-200">g</span>
                    <Btn onClick={() => addToStock(food)} className="!py-1 !px-3 !text-xs">
                      {t('stock.add', locale)}
                    </Btn>
                  </div>
                ) : (
                  <div
                    onClick={() => { setAddingId(food.id); setAddGrams('500'); }}
                    className="food-result px-4 py-3 flex justify-between items-center border-b border-cream-300/50 dark:border-bark-400/50 last:border-0 cursor-pointer hover:bg-cream-100 dark:hover:bg-bark-500 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-body font-semibold text-sm text-bark-500 dark:text-cream-200 truncate">{food.label}</div>
                      <div className="font-body text-[11px] text-bark-200 dark:text-bark-100">{food.category}</div>
                    </div>
                    <span className="text-lg text-terra-500 flex-shrink-0 ms-2">+</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current stock */}
      {stock.length > 0 ? (
        <Card>
          <h3 className="font-display text-[15px] text-bark-500 dark:text-cream-200 mb-3">
            {t('stock.current', locale)} ({stock.length})
          </h3>
          {stock.map((item) => {
            const pct = pctLeft(item);
            const isLow = pct <= 10 && item.quantity_grams > 0;
            const isEmpty = item.quantity_grams <= 0;
            const isEditing = editingId === item.food_id;

            return (
              <div key={item.food_id} className="flex items-center justify-between py-2.5 border-b border-cream-300 dark:border-bark-400 last:border-0 gap-2">
                <div className="min-w-0 flex-1">
                  <span className={`font-body text-sm font-semibold block truncate ${isEmpty ? 'text-bark-200 line-through' : 'text-bark-500 dark:text-cream-200'}`}>
                    {item.food_label}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-cream-300 dark:bg-bark-400 overflow-hidden max-w-[100px]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background: isLow ? '#E74C3C' : isEmpty ? '#999' : '#4CAF50',
                        }}
                      />
                    </div>
                    <span className="font-body text-[11px] text-bark-200 dark:text-bark-100">{pct}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => { updateStock(item, parseInt(editValue) || 0); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') updateStock(item, parseInt(editValue) || 0); }}
                        autoFocus
                        className="w-16 px-2 py-1 rounded-lg border-2 border-terra-500 bg-cream-50 dark:bg-bark-600 font-body text-sm text-center"
                      />
                      <span className="font-body text-[11px] text-bark-200">g</span>
                    </>
                  ) : (
                    <button
                      onClick={() => { setEditingId(item.food_id); setEditValue(String(Math.round(item.quantity_grams))); }}
                      className="px-2 py-1 rounded-lg bg-cream-100 dark:bg-bark-500 font-body text-sm font-bold text-bark-500 dark:text-cream-200 border border-cream-300 dark:border-bark-400"
                    >
                      {Math.round(item.quantity_grams)}g
                    </button>
                  )}
                  <button
                    onClick={() => deleteStock(item.food_id)}
                    className="text-bark-200 dark:text-bark-100 text-sm p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </Card>
      ) : (
        <Card>
          <p className="font-body text-sm text-bark-200 dark:text-bark-100 text-center py-4">
            {t('stock.empty', locale)}
          </p>
        </Card>
      )}
    </div>
  );
}
