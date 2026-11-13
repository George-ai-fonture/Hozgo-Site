import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";

export default function Home() {
  return (
    <>
      <PageMeta title="Home" description="Enter your postcodes and see a guide price in seconds." />
      <Container className="py-16 sm:py-24">
        <h1 className="text-4xl">Home</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Placeholder for the Home page. Content to follow.</p>
      </Container>
    </>
  );
}
