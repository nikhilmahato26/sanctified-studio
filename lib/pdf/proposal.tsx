import "server-only";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { TimelineItem } from "@/lib/pdf/types";
import { EventDetailPages, type EventKind } from "@/lib/pdf/event-details";
import { formatDateRange } from "@/lib/utils";

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
  // Timeline
  stage: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  stageHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  stageTitle: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  stageDate: { fontSize: 10, color: COLORS.clay },
  bulletRow: { flexDirection: "row", marginTop: 3, paddingRight: 8 },
  bulletDot: { width: 12, color: COLORS.clay },
  bulletText: { flex: 1 },
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

/** Format a timeline stage's date range from stored ISO date strings. */
function stageDates(start: string, end: string): string {
  if (!start && !end) return "";
  if (!start) return formatDateRange(end);
  return formatDateRange(start, end || null);
}

export interface ProposalPdfData {
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  /** Raw event kind, drives which detailed pages lead the proposal. */
  eventKind: EventKind;
  eventDate: string;
  venue?: string | null;
  timeline: TimelineItem[];
  deliverables: string[];
  terms: string[];
  total: number;
  notes?: string | null;
  date: string;
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function ProposalDocument({ data }: { data: ProposalPdfData }) {
  return (
    <Document
      title={`Proposal ${data.proposalNumber}`}
      author="Sanctified Studio"
    >
      {/* Detailed event pages lead the document; the quote page is last. */}
      <EventDetailPages eventKind={data.eventKind} />

      <Page size="A4" style={styles.page} wrap>
        <View>
          <Text style={styles.brand}>Sanctified Studio</Text>
          <Text style={styles.tagline}>Moments worth keeping.</Text>
        </View>

        <View style={styles.divider} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.h1}>Photography quotation</Text>
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

        {data.timeline.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Event timeline</Text>
            {data.timeline.map((stage, i) => {
              const dates = stageDates(stage.start, stage.end);
              return (
                <View style={styles.stage} key={i} wrap={false}>
                  <View style={styles.stageHead}>
                    <Text style={styles.stageTitle}>
                      {stage.title || `Stage ${i + 1}`}
                    </Text>
                    {dates ? <Text style={styles.stageDate}>{dates}</Text> : null}
                  </View>
                  {stage.services.map((s, j) => (
                    <Bullet key={j}>{s}</Bullet>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{inr(data.total)}</Text>
        </View>

        {data.deliverables.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Deliverables</Text>
            {data.deliverables.map((d, i) => (
              <Bullet key={i}>{d}</Bullet>
            ))}
          </View>
        )}

        {data.terms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Terms &amp; conditions</Text>
            {data.terms.map((t, i) => (
              <Bullet key={i}>{t}</Bullet>
            ))}
          </View>
        )}

        {data.notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.notes}>{data.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer} fixed>
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
