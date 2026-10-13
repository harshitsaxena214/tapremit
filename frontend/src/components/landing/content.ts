export interface NavLink {
  label: string;
  href: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface WhyItem {
  title: string;
  description: string;
}

export const LANDING_CONTENT = {
  pill: 'Monad testnet demo',
  h1: {
    line1: 'Say what to pay.',
    line2: 'Approve every payment.',
  },
  subtext:
    'Describe a payment in plain language. An AI assistant turns it into a proposal that respects your spending limits, you review and approve it, and it settles on the Monad testnet with a receipt and a full audit trail.',
  nav: {
    links: [
      { label: 'How it works', href: '#how' },
      { label: 'Why TapRemit', href: '#why' },
      { label: 'Testnet demo', href: '#testnet' },
    ] as NavLink[],
    cta: 'Launch app',
  },
  actions: {
    primary: 'Launch app',
    secondary: 'How it works →',
  },
  how: {
    overline: 'HOW IT WORKS',
    heading: 'Three steps. You stay in control.',
    steps: [
      {
        number: '01',
        title: 'Describe the payment',
        description: 'Type what you want to pay in plain language.',
      },
      {
        number: '02',
        title: 'Review the proposal',
        description: 'See the amount, the recipient and your limits, then approve or reject.',
      },
      {
        number: '03',
        title: 'See the receipt',
        description: 'Every payment settles with a block explorer link and an audit timeline.',
      },
    ] as StepItem[],
  },
  why: {
    overline: 'WHY TAPREMIT',
    heading: 'Built so a human always has the final say.',
    items: [
      {
        title: 'Human approval, always',
        description: 'Nothing is sent until you approve it.',
      },
      {
        title: 'Spending limits',
        description: 'Policies cap what can be proposed.',
      },
      {
        title: 'A clear audit trail',
        description: 'Every step is recorded on the receipt.',
      },
    ] as WhyItem[],
  },
  testnet: {
    badge: 'TESTNET ENVIRONMENT',
    title: 'Monad Testnet Demo',
    description:
      'This is a hackathon demo on the Monad testnet. Wallets are demo wallets and no real money moves.',
    button: 'Open Demo',
  },
  footer: {
    text: 'TapRemit, built for the Monad Metropolis hackathon.',
    github: 'GitHub ↗',
  },
} as const;
