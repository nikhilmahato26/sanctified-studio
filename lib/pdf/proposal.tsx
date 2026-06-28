import "server-only";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { LineItem } from "@/lib/pdf/types";

const COLORS = {
  espresso: "#3A322B",
  clay: "#A1846B",
  sand: "#E9E0D4",
  muted: "#8A7E70",
  line: "#E3D9CB",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontSize: 11,
    color: COLORS.espresso,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", color: COLORS.espresso },
  tagline: { fontSize: 10, color: COLORS.clay, marginTop: 2 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    marginVertical: 18,
  },
  h1: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  meta: { fontSize: 10, color: COLORS.muted },
  section: { marginTop: 20 },
  label: {
    fontSize: 9,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  itemLabel: { flex: 1, paddingRight: 12 },
  amount: { fontFamily: "Helvetica-Bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: COLORS.espresso,
  },
  totalLabel: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  totalValue: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  notes: { marginTop: 8, color: COLORS.espresso },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 56,
    right: 56,
    fontSize: 9,
    color: COLORS.muted,
    textAlign: "center",
  },
});

function inr(n: number) {
  return "INR " + n.toLocaleString("en-IN");
}

export interface ProposalPdfData {
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: string;
  venue?: string | null;
  lineItems: LineItem[];
  total: number;
  notes?: string | null;
  date: string;
}

function ProposalDocument({ data }: { data: ProposalPdfData }) {
  return (
    <Document
      title={`Proposal ${data.proposalNumber}`}
      author="Sanctified Studio"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.brand}>Sanctified Studio</Text>
          <Text style={styles.tagline}>Moments worth keeping.</Text>
        </View>

        <View style={styles.divider} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.h1}>Photography proposal</Text>
            <Text style={styles.meta}>No. {data.proposalNumber}</Text>
            <Text style={styles.meta}>Date: {data.date}</Text>
          </View>
          <View>
            <Text style={styles.label}>Prepared for</Text>
            <Text>{data.clientName}</Text>
            <Text style={styles.meta}>{data.clientEmail}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Event</Text>
          <Text>
            {data.eventType} · {data.eventDate}
            {data.venue ? ` · ${data.venue}` : ""}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Investment</Text>
          {data.lineItems.map((item, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.amount}>{inr(item.amount)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{inr(data.total)}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.notes}>{data.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          Sanctified Studio · hello@sanctifiedstudio.com · Thank you for
          considering us.
        </Text>
      </Page>
    </Document>
  );
}

export function renderProposalPdf(data: ProposalPdfData): Promise<Buffer> {
  return renderToBuffer(<ProposalDocument data={data} />);
}
