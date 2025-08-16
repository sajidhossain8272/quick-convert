import React, { useEffect, useState } from "react";

const PAYPAL_EMAIL = "sajidhossain321@gmail.com";

const BTC_ADDRESS = "1MsacszQ2WMTbaVAiKa1N6uMzgSuhsR1r";
const ETH_ADDRESS = "0x4246fd3dc05bf5bcaef0f4f8b380a3e33dbcb6a7";
const USDT_ADDRESSES = {
  TRC20: "TKanzzrGZr3K4GgGbmfLrquhKgqEjN1Z4A",
  ERC20: "0x4246fd3dc05bf5bcaef0f4f8b380a3e33dbcb6a7",
  BEP20: "0x4246fd3dc05bf5bcaef0f4f8b380a3e33dbcb6a7",
} as const;

type UsdtNetwork = keyof typeof USDT_ADDRESSES;
type Method = "PayPal" | "Bitcoin" | "Ethereum" | "USDT" ;

/* ---------- Icons (inline SVGs for zero deps) ---------- */
const Icon = {
  paypal: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M13.5 3a6.5 6.5 0 0 1 6.28 8.1c-.64 2.42-2.95 4.07-5.47 4.07H12l-.61 3.5H8l1.67-9.5h3.64c.9 0 1.62-.73 1.62-1.62S14.21 5.9 13.31 5.9H9.67l.34-2h3.49z'
      />
    </svg>
  ),
  bitcoin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1.93 9.31c.79-.38 1.28-1.02 1.16-1.92-.15-1.1-1.08-1.54-2.27-1.7l.19-1.53-1.1-.14-.19 1.51c-.29-.04-.58-.08-.86-.12l.19-1.52-1.1-.14-.19 1.53c-.23-.03-.46-.06-.68-.09l-1.22-.16-.28 1.15s.65.1.63.08c.35.05.41.31.4.5L6.6 15.9c-.04.28-.2.72-.63.66.02.02-.63-.08-.63-.08l-.34 1.29 1.15.16c.21.03.42.06.62.09l-.19 1.55 1.1.14.19-1.53c.29.04.58.08.86.12l-.19 1.53 1.1.14.19-1.55c1.87.35 3.28.21 3.86-1.49.47-1.33-.02-2.1-1.01-2.6zm-3.2 3.23.37-2.94c.89.22 3.65.67 3.3 1.96-.36 1.36-2.18.9-2.67.98zm.54-4.23.33-2.6c.73.1 2.99.31 2.66 1.63-.31 1.25-2.21.86-2.99.97z'
      />
    </svg>
  ),
  ethereum: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M12 2 5 12l7-3 7 3-7-10Zm0 20 7-10-7 3-7-3 7 10Z'
      />
    </svg>
  ),
  tether: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M3 5h18v4c0 3.87-3.58 7-8 7v3h-2v-3c-4.42 0-8-3.13-8-7V5Zm8 2v3.06c-.64.04-1.25.1-1.8.19C8.13 10.42 8 10.61 8 10.8c0 .42 1.79.76 4 .76s4-.34 4-.76c0-.19-.13-.38-1.2-.55-.55-.09-1.16-.15-1.8-.19V7h-2Z'
      />
    </svg>
  ),
  bkash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M12 2c5.5 0 10 3.6 10 8.1 0 2.8-1.8 5.2-4.6 6.7L18 22l-3.6-2c-.8.2-1.5.3-2.4.3C6.5 20.3 2 16.7 2 12.1 2 5.6 6.5 2 12 2Z'
      />
    </svg>
  ),
  nagad: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M12 2 4 6v12l8 4 8-4V6l-8-4Zm0 3.2 5 2.5v8.6l-5 2.5-5-2.5V7.7l5-2.5Z'
      />
    </svg>
  ),
  copy: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden
      {...props}
    >
      <path
        d='M9 9.75A2.25 2.25 0 0 1 11.25 7.5h6A2.25 2.25 0 0 1 19.5 9.75v6A2.25 2.25 0 0 1 17.25 18h-6A2.25 2.25 0 0 1 9 15.75v-6Z'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <path
        d='M6.75 16.5h-.75A2.25 2.25 0 0 1 3.75 14.25v-6A2.25 2.25 0 0 1 6 6h6c.414 0 .75.336.75.75v.75'
        stroke='currentColor'
        strokeWidth='1.6'
      />
    </svg>
  ),
};

/* ---------- Toast ---------- */
const Toast = ({ message }: { message: string }) => (
  <>
    {/* tiny CSS for animation; respects reduced motion (see below) */}
    <style>{`
      @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes toastOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(8px); } }
      .animate-toast { animation: toastIn 180ms ease-out; }
      .animate-toast-leave { animation: toastOut 200ms ease-in forwards; }
      @media (prefers-reduced-motion: reduce) {
        .animate-toast, .animate-toast-leave { animation: none; }
      }
    `}</style>
    <div className='fixed bottom-5 right-5 z-50 rounded-lg bg-neutral-900 text-white text-sm px-4 py-2 shadow-xl animate-toast'>
      {message}
    </div>
  </>
);

/* ---------- Reusable Copy Field ---------- */
const CopyField = ({
  label,
  value,
  onCopy,
  copyLabel = "Copy",
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copyLabel?: string;
}) => {
  return (
    <div className='w-full'>
      <p className='mb-2 text-sm text-neutral-600 dark:text-neutral-300'>
        {label}
      </p>
      <div className='flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 backdrop-blur px-4 py-3 shadow-sm'>
        <code className='flex-1 break-all text-sm text-neutral-900 dark:text-neutral-100'>
          {value}
        </code>
        <button
          type='button'
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          className='inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-offset-neutral-900/20'
        >
          <Icon.copy />
          {copyLabel}
        </button>
      </div>
    </div>
  );
};

/* ---------- Crypto Warning ---------- */
const CryptoWarning = () => (
  <div className='mt-5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-100/20 dark:border-amber-400 p-4'>
    <p className='text-sm font-semibold text-amber-900 dark:text-amber-200'>
      Important Crypto Notice
    </p>
    <ul className='mt-2 list-disc space-y-1 pl-5 text-xs text-amber-900 dark:text-amber-100'>
      <li>These crypto addresses are custodial (from Binance).</li>
      <li>
        <strong>Bitcoin:</strong> send <strong>BTC only</strong> to the BTC
        address. Do not send tokens or other assets — they will be lost.
      </li>
      <li>
        <strong>Ethereum:</strong> send <strong>ETH only</strong> to the ETH
        address. Do not send other ERC-20 tokens here unless specified.
      </li>
      <li>
        <strong>USDT:</strong> use the exact network (TRC20 / ERC20 / BEP20).
        Wrong networks or other coins/tokens will be lost.
      </li>
    </ul>
  </div>
);

const Donation: React.FC = () => {
  const [method, setMethod] = useState<Method>(() => {
    const saved = localStorage.getItem("donation-method") as Method | null;
    return saved ?? "PayPal";
  });
  const [usdtNet, setUsdtNet] = useState<UsdtNetwork>("TRC20");
  const [toast, setToast] = useState<{ msg: string; leaving?: boolean } | null>(
    null
  );

  // Persist last selected method
  useEffect(() => {
    localStorage.setItem("donation-method", method);
  }, [method]);

  const showToast = (msg: string) => {
    // enter
    setToast({ msg });
    // schedule leave
    const t = setTimeout(() => {
      setToast({ msg, leaving: true });
      setTimeout(() => setToast(null), 210);
    }, 1800);
    return () => clearTimeout(t);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(`${label} copied`));
  };

  const TabButton = ({
    name,
    icon,
  }: {
    name: Method;
    icon: React.ReactNode;
  }) => {
    const active = method === name;
    return (
      <button
        onClick={() => setMethod(name)}
        aria-selected={active}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
          active
            ? "bg-neutral-900 text-white"
            : "text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
        }`}
      >
        <span className='h-4 w-4'>{icon}</span>
        {name}
      </button>
    );
  };

  return (
    <section className='w-full bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900'>
      {/* subtle hero shine */}
      <div className='relative mx-auto max-w-5xl px-4 pt-14 pb-6'>
        <div className='pointer-events-none absolute inset-x-0 -top-8 mx-auto h-24 w-[360px] rounded-full bg-white/40 blur-2xl dark:bg-white/10' />
        <header className='text-center'>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white'>
            Support My Work{" "}
            <span role='img' aria-label='coffee'>
              ☕
            </span>
          </h1>
          <p className='mt-3 text-neutral-600 dark:text-neutral-300'>
            Every contribution helps me keep creating! Choose a method below and
            send your support—big or small, it means a lot.
          </p>
        </header>
      </div>

      {/* Tabs */}
      <div className='mx-auto max-w-3xl px-4'>
        <div className='no-scrollbar relative mx-auto flex max-w-full items-center justify-center overflow-x-auto'>
          <div className='inline-flex gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur p-1 shadow-sm'>
            <TabButton
              name='PayPal'
              icon={<Icon.paypal className='text-blue-600' />}
            />
            <TabButton
              name='Bitcoin'
              icon={<Icon.bitcoin className='text-amber-500' />}
            />
            <TabButton
              name='Ethereum'
              icon={<Icon.ethereum className='text-indigo-500' />}
            />
            <TabButton
              name='USDT'
              icon={<Icon.tether className='text-green-600' />}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className='mx-auto max-w-3xl px-4 py-10'>
        <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-6 shadow-xl'>
          {method === "PayPal" && (
            <>
              <h3 className='mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
                PayPal
              </h3>
              <CopyField
                label='PayPal Business Email'
                value={PAYPAL_EMAIL}
                onCopy={() => handleCopy(PAYPAL_EMAIL, "PayPal email")}
              />
              <p className='mt-2 text-xs text-neutral-500 dark:text-neutral-400'>
                Paste this email in PayPal and send any amount.
              </p>
            </>
          )}

 

    

          {method === "Bitcoin" && (
            <>
              <h3 className='mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
                Bitcoin (BTC)
              </h3>
              <CopyField
                label='BTC Address'
                value={BTC_ADDRESS}
                onCopy={() => handleCopy(BTC_ADDRESS, "BTC address")}
              />
              <CryptoWarning />
            </>
          )}

          {method === "Ethereum" && (
            <>
              <h3 className='mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
                Ethereum (ETH)
              </h3>
              <CopyField
                label='ETH Address'
                value={ETH_ADDRESS}
                onCopy={() => handleCopy(ETH_ADDRESS, "ETH address")}
              />
              <CryptoWarning />
            </>
          )}

          {method === "USDT" && (
            <>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <h3 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
                  USDT (Tether)
                </h3>
                <div className='inline-flex rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/60 backdrop-blur'>
                  {(["TRC20", "ERC20", "BEP20"] as UsdtNetwork[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setUsdtNet(n)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition ${
                        usdtNet === n
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700/60"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <CopyField
                label={`USDT Address (${usdtNet})`}
                value={USDT_ADDRESSES[usdtNet]}
                onCopy={() =>
                  handleCopy(
                    USDT_ADDRESSES[usdtNet],
                    `USDT (${usdtNet}) address`
                  )
                }
              />
              <CryptoWarning />
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={toast.leaving ? "animate-toast-leave" : ""}>
          <Toast message={toast.msg} />
        </div>
      )}
    </section>
  );
};

export default Donation;
