export default function ConfirmationPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Order Confirmed</h1>
      <p>Order <strong>#100231</strong> is Processing. Delivery estimate: 3–5 business days.</p>
      <p className="text-ash">You can view this order in the Account area (mock).</p>
      <a href="/" className="text-indigo">Continue Shopping</a>
    </section>
  );
}
