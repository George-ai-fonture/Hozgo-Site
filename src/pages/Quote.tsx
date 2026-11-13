import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";

export default function Quote() {
  return (
    <>
      <PageMeta title="Get a quote" description="Enter your postcodes and see a guide price in seconds." />
      <Container className="py-16 sm:py-24">
        <h1 className="text-4xl">Get a quote</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Placeholder for the Get a quote page. Content to follow.</p>
      </Container>
    </>
  );
}
