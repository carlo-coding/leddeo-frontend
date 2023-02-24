declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface PricingPageProps {
  customerId?: string;
  email?: string;
}

export function PricingPage({ customerId, email }: PricingPageProps) {
  /* return (
    <stripe-pricing-table
      pricing-table-id={import.meta.env.VITE_STRIPE_TABLE_ID}
      publishable-key={import.meta.env.VITE_STRIPE_PUBLIC_KEY}
      customer-id={customerId}
      customer-email={email}
    ></stripe-pricing-table>
  ); */
  return <></>;
}
