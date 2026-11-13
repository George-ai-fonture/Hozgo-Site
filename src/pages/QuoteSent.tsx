import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";

export default function QuoteSent() {
  return (
    <>
      <PageMeta title="Quote sent" description="Your quote request has been sent to HOZGO." />
      <Container className="py-16 sm:py-24">
        <h1 className="text-4xl">Quote sent</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Placeholder for the Quote sent page. Content to follow.</p>
      </Container>
    </>
  );
}
