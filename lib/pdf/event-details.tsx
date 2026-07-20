import "server-only";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * Detailed event pages that lead a proposal. The price page (see proposal.tsx)
 * is appended AFTER these, as the final page of the document.
 *
 * This is template content. To replace it with your own detailed deck later,
 * either edit the `DETAIL_CONTENT` data below, or — if you have a ready-made
 * PDF — we can merge it in with pdf-lib instead of rendering these pages.
 */

export type EventKind = string;

const COLORS = {
  espresso: "#3A322B",
  clay: "#A1846B",
  sand: "#E9E0D4",
  sage: "#9CA88F",
  blush: "#E4C9C2",
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
    lineHeight: 1.6,
  },
  brand: { fontSize: 12, fontFamily: "Helvetica-Bold", color: COLORS.espresso },
  tagline: { fontSize: 9, color: COLORS.clay, marginTop: 1 },
  accentBar: { height: 4, borderRadius: 2, marginTop: 14, marginBottom: 22 },
  // Cover
  coverWrap: { marginTop: 90 },
  kicker: {
    fontSize: 10,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 10,
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.15,
    marginBottom: 14,
  },
  coverIntro: { fontSize: 12, color: COLORS.espresso, maxWidth: 380 },
  // Content
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  intro: { fontSize: 11, color: COLORS.muted, marginBottom: 12, maxWidth: 400 },
  section: { marginTop: 16 },
  heading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  body: { color: COLORS.espresso },
  bulletRow: { flexDirection: "row", marginTop: 4, paddingRight: 8 },
  bulletDot: { width: 12, color: COLORS.clay },
  bulletText: { flex: 1 },
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

interface DetailSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

interface DetailPage {
  cover?: boolean;
  kicker: string;
  title: string;
  intro?: string;
  sections?: DetailSection[];
}

const DETAIL_CONTENT: Record<string, { accent: string; pages: DetailPage[] }> = {
  WEDDING: {
    accent: COLORS.sage,
    pages: [
      {
        cover: true,
        kicker: "Wedding Photography",
        title: "Your day,\nbeautifully kept.",
        intro:
          "A calm, unobtrusive record of the day as it truly felt — the quiet glances, the loud joy, and everything in between. Here is how we would care for yours.",
      },
      {
        kicker: "Our approach",
        title: "How we photograph a wedding",
        intro:
          "We work gently and in the background, letting the day unfold on its own terms while we quietly gather the moments that matter.",
        sections: [
          {
            heading: "Documentary first",
            body: "Most of the day is captured candidly — real reactions, not posed ones. We stay close but out of the way.",
          },
          {
            heading: "A little direction, when it helps",
            body: "For portraits and family groups we guide you warmly and efficiently, so you spend more time with your guests.",
          },
          {
            heading: "Two photographers",
            body: "A lead and a second shooter cover two angles at once — the aisle and the faces, the vows and the tears.",
          },
          {
            heading: "Light we love",
            body: "We favour soft, natural light and a warm, timeless edit that will still feel right in twenty years.",
          },
        ],
      },
      {
        kicker: "What you receive",
        title: "Deliverables & the day itself",
        sections: [
          {
            heading: "Your gallery",
            bullets: [
              "A private online gallery of edited high-resolution images",
              "Personal printing and download rights",
              "A curated highlight set for easy sharing",
            ],
          },
          {
            heading: "How the day runs",
            bullets: [
              "Pre-wedding call to plan timings and must-have shots",
              "Full-day coverage from preparations to the celebration",
              "Sneak-peek preview within a few days",
              "Complete gallery delivered in 4–6 weeks",
            ],
          },
        ],
      },
    ],
  },
  BABY_SHOWER: {
    accent: COLORS.blush,
    pages: [
      {
        cover: true,
        kicker: "Maternity Photography",
        title: "A tender\nmilestone, held.",
        intro:
          "Soft, joyful frames of the people and the little details around a new beginning. Here is how we would capture your celebration.",
      },
      {
        kicker: "Our approach",
        title: "How we photograph a maternity session",
        intro:
          "Relaxed and unhurried — we follow the warmth of the room and let the celebration lead the way.",
        sections: [
          {
            heading: "Gentle and candid",
            body: "We photograph the laughter, the games, and the quiet moments of anticipation as they happen.",
          },
          {
            heading: "The details matter",
            body: "The décor, the cake, the little outfits and gifts — the touches you planned are part of the story.",
          },
          {
            heading: "Portraits with the parents-to-be",
            body: "A short, comfortable set of portraits with family and close friends, guided lightly.",
          },
          {
            heading: "A soft, warm edit",
            body: "Bright, airy colours that keep the mood as sweet as the day itself.",
          },
        ],
      },
      {
        kicker: "What you receive",
        title: "Deliverables & the day itself",
        sections: [
          {
            heading: "Your gallery",
            bullets: [
              "A private online gallery of edited high-resolution images",
              "Personal printing and download rights",
              "A curated highlight set for easy sharing",
            ],
          },
          {
            heading: "How the day runs",
            bullets: [
              "Quick call beforehand to confirm timings and key people",
              "Coverage of the celebration from arrivals through cake",
              "Sneak-peek preview within a few days",
              "Complete gallery delivered in 2–3 weeks",
            ],
          },
        ],
      },
    ],
  },
};

function Footer() {
  return (
    <Text style={styles.footer} fixed>
      Sanctified Studio · sanctifiedstudiojbp@gmail.com · Moments worth keeping.
    </Text>
  );
}

/**
 * Renders the detailed event pages for a given event kind. Returns an array of
 * <Page> elements so it can sit inside the proposal <Document> before the
 * price page.
 */
export function EventDetailPages({ eventKind }: { eventKind: EventKind }) {
  const content = DETAIL_CONTENT[eventKind] ?? DETAIL_CONTENT.WEDDING;

  return (
    <>
      {content.pages.map((p, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View>
            <Text style={styles.brand}>Sanctified Studio</Text>
            <Text style={styles.tagline}>Moments worth keeping.</Text>
            <View
              style={[styles.accentBar, { backgroundColor: content.accent }]}
            />
          </View>

          {p.cover ? (
            <View style={styles.coverWrap}>
              <Text style={styles.kicker}>{p.kicker}</Text>
              <Text style={styles.coverTitle}>{p.title}</Text>
              {p.intro ? <Text style={styles.coverIntro}>{p.intro}</Text> : null}
            </View>
          ) : (
            <View>
              <Text style={styles.kicker}>{p.kicker}</Text>
              <Text style={styles.h1}>{p.title}</Text>
              {p.intro ? <Text style={styles.intro}>{p.intro}</Text> : null}

              {p.sections?.map((s, i) => (
                <View style={styles.section} key={i}>
                  <Text style={styles.heading}>{s.heading}</Text>
                  {s.body ? <Text style={styles.body}>{s.body}</Text> : null}
                  {s.bullets?.map((b, j) => (
                    <View style={styles.bulletRow} key={j}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          <Footer />
        </Page>
      ))}
    </>
  );
}
