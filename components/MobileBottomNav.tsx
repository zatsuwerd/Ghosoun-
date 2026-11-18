'use client';

import { Home, ShoppingBag, Heart, ShoppingCart, Menu } from 'lucide-react';

export type MobileNavTab = 'home' | 'shop' | 'wishlist' | 'cart' | 'menu';

interface MobileBottomNavProps {
  activeTab: MobileNavTab;
  cartCount: number;
  wishlistCount: number;
  onSelectHome: () => void;
  onSelectShop: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenMenu: () => void;
}

export default function MobileBottomNav({
  activeTab,
  cartCount,
  wishlistCount,
  onSelectHome,
  onSelectShop,
  onOpenWishlist,
  onOpenCart,
  onOpenMenu,
}: MobileBottomNavProps) {
  const items: Array<{
    key: MobileNavTab;
    label: string;
    icon: typeof Home;
    badge?: number;
    onClick: () => void;
  }> = [
    { key: 'home', label: 'Home', icon: Home, onClick: onSelectHome },
    { key: 'shop', label: 'Shop', icon: ShoppingBag, onClick: onSelectShop },
    {
      key: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
      onClick: onOpenWishlist,
    },
    {
      key: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : undefined,
      onClick: onOpenCart,
    },
    { key: 'menu', label: 'Menu', icon: Menu, onClick: onOpenMenu },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      data-testid="mobile-bottom-nav"
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 h-[60px] bg-[#FAF9F5]/95 backdrop-blur-sm border-t border-[#E2DDD2] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-full max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              aria-label={
                item.badge ? `${item.label} (${item.badge})` : item.label
              }
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[48px] transition-colors cursor-pointer select-none ${
                isActive
                  ? 'text-[#217C42]'
                  : 'text-[#526162] hover:text-[#0D2F32]'
              }`}
            >
              <span className="relative inline-flex items-center justify-center">
                <Icon className="w-[21px] h-[21px] stroke-[1.75]" aria-hidden="true" />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -end-2.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-semibold leading-[16px] text-center tabular-nums ${
                      item.key === 'cart'
                        ? 'bg-[#0D2F32] text-[#FAF9F5]'
                        : 'bg-[#217C42] text-[#FAF9F5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium leading-none tracking-[0.01em]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
