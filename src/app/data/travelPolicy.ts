// The one place the company's travel rules are written down. The policy dialog
// and the Policies page both read it, so the page can never drift from the
// rule the agent cited in a note beside a flagged line.

export interface PolicyFigure {
  label: string;
  value: string;
}

export interface PolicyClause {
  ref: string;
  text: string;
  figures?: PolicyFigure[];
}

export interface PolicySection {
  number: string;
  title: string;
  clauses: PolicyClause[];
}

// The policy the agent keeps citing. Every figure here is one the product uses
// somewhere else — the $180 Tier 2 cap in the hotel's Agent Note, the 20%
// manager band, the single quarterly exception, economy under six hours. A
// policy screen that disagreed with the notes beside it would be worse than
// none, so this is the one place those numbers are written down.

export const POLICY: {
  version: string;
  effective: string;
  sections: PolicySection[];
} = {
  version: "v4.2",
  effective: "Effective 1 January 2027",
  sections: [
    {
      number: "3",
      title: "Air travel",
      clauses: [
        {
          ref: "3.1",
          text: "Economy on flights under six hours. Premium economy is allowed beyond six hours; business class needs VP sign-off before booking.",
        },
        {
          ref: "3.2",
          text: "Book at least 14 days ahead. Inside 7 days a manager approves the fare difference.",
        },
        {
          ref: "3.3",
          text: "Mainline carriers only. Ultra-low-cost carriers are not reimbursable — their fares exclude the bag, the seat and the change a work trip needs.",
        },
      ],
    },
    {
      number: "4",
      title: "Lodging",
      clauses: [
        {
          ref: "4.1",
          text: "Rated hotels only, three star or above. Hostels, shared rooms and unrated properties are not bookable on company travel.",
        },
        {
          ref: "4.2",
          text: "Nightly caps before tax: Tier 1 $260, Tier 2 $180, Tier 3 $140. A manager may approve up to 20% over cap; beyond that it goes to Finance.",
          figures: [
            { label: "Tier 1 — NYC, SF, London", value: "$260 / night" },
            { label: "Tier 2 — Austin, Seattle, Chicago", value: "$180 / night" },
            { label: "Tier 3 — everywhere else", value: "$140 / night" },
          ],
        },
        {
          ref: "4.3",
          text: "Nobody is asked to share a room. Where a traveller offers to, the saving is theirs to keep as a meal credit.",
        },
      ],
    },
    {
      number: "5",
      title: "Per diems",
      clauses: [
        {
          ref: "5.1",
          text: "Allowances are drawn against, not paid out. Anything unspent stays with the company.",
          figures: [
            { label: "Meals", value: "$133 / day" },
            { label: "Ground transport", value: "$80 / day" },
            { label: "Receipt required above", value: "$25" },
          ],
        },
      ],
    },
    {
      number: "6",
      title: "Expenses",
      clauses: [
        {
          ref: "6.1",
          text: "File within 14 days of returning. Worktrip Autopilot files what it books; the rest is a photo of the receipt.",
        },
        {
          ref: "6.2",
          text: "Not reimbursable: minibar, in-flight wifi above $30, personal entertainment, companion travel, and fines of any kind.",
        },
      ],
    },
    {
      number: "7",
      title: "Exceptions",
      clauses: [
        {
          ref: "7.1",
          text: "One lodging exception per traveller per quarter, approved by a manager. A second needs written Finance approval with the reason recorded.",
        },
        {
          ref: "7.2",
          text: "Anything over a stated limit is never approved after the fact. Ask first.",
        },
      ],
    },
  ],
};
