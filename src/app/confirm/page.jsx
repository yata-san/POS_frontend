"use client";
import React from "react";
import { useContext } from "react";
import { useRouter } from "next/navigation";

const CartContext = global.CartContext || React.createContext({ cart: [], setCart: () => {} });
global.CartContext = CartContext;

export default function ConfirmPage() {
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext);
  const subtotal = cart.reduce((sum, item) => sum + item.PRICE * item.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  // 購入処理
  const handlePurchase = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        subtotal,
        total
      })
    });
    if (res.ok) {
      setCart([]); // カートを空にする
      router.push("/complete");
    } else {
      alert("購入処理に失敗しました");
    }
  };

  console.log(process.env.NEXT_PUBLIC_API_ENDPOINT + "/purchase");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      <div className="w-full max-w-md bg-[#FBFAFA] rounded-lg shadow-md p-8 flex flex-col items-center border border-[#747474]">
        <div className="text-lg font-bold mb-4">購入確認</div>
        <div className="text-base mb-2">合計金額</div>
        <div className="text-2xl font-bold text-red-600 mb-6">{total}円</div>
        <div className="flex w-full gap-4 justify-center">
          <button
            className="w-[141px] bg-[#F3E89A] rounded px-6 py-3 shadow border border-[#747474] text-black font-bold text-base"
            onClick={handlePurchase}
          >
            OK
          </button>
          <button
            className="w-[141px] bg-white rounded px-6 py-3 shadow border border-[#747474] text-black font-bold text-base"
            onClick={() => router.push("/cart")}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
} 