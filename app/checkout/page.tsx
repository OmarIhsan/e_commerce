export default function CheckoutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Checkout (Mock)</h1>
      <p className="text-ash">This is a portfolio demo. No real payments are processed.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-mist rounded-subtle p-4">
          <h2 className="font-semibold mb-2">Shipping</h2>
          <p className="text-sm text-ash">Economy 5–8 days; Standard 3–5; Express 1–2; Free over 75.</p>
        </div>
        <div className="border border-mist rounded-subtle p-4">
          <h2 className="font-semibold mb-2">Payment (Mock)</h2>
          <p className="text-sm text-ash">Visa ending 4242; Mastercard ending 4444.</p>
        </div>
      </div>
      <a href="/confirmation" className="rounded-subtle bg-indigo text-paper px-4 py-2">Place Order (Demo)</a>
    </section>
  );
}
