import "server-only";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const COLORS = {
  espresso: "#3A322B",
  clay: "#A1846B",
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
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  tagline: { fontSize: 10, color: COLORS.clay, marginTop: 2 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    marginVertical: 18,
  },
  h1: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  meta: { fontSize: 10, color: COLORS.muted },
  label: {
    fontSize: 9,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  section: { marginTop: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  dueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: COLORS.espresso,
  },
  dueLabel: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  dueValue: { fontSize: 13, fontFamily: "Helvetica-Bold" },
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

export interface InvoicePdfData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: string;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  date: string;
}

function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  return (
    <Document title={`Invoice ${data.invoiceNumber}`} author="Sanctified Studio">
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.brand}>Sanctified Studio</Text>
          <Text style={styles.tagline}>Moments worth keeping.</Text>
        </View>

        <View style={styles.divider} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.h1}>Invoice</Text>
            <Text style={styles.meta}>No. {data.invoiceNumber}</Text>
            <Text style={styles.meta}>Date: {data.date}</Text>
          </View>
          <View>
            <Text style={styles.label}>Billed to</Text>
            <Text>{data.clientName}</Text>
            <Text style={styles.meta}>{data.clientEmail}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Event</Text>
          <Text>
            {data.eventType} · {data.eventDate}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Total</Text>
            <Text style={styles.bold}>{inr(data.totalAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Paid</Text>
            <Text style={styles.bold}>− {inr(data.advancePaid)}</Text>
          </View>
          <View style={styles.dueRow}>
            <Text style={styles.dueLabel}>Balance due</Text>
            <Text style={styles.dueValue}>{inr(data.balanceDue)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Sanctified Studio · hello@sanctifiedstudio.com · Thank you.
        </Text>
      </Page>
    </Document>
  );
}

export function renderInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />);
}
