import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";

export default function Privacy() {
  return (
    <>
      <PageMeta title="Privacy" description="How HOZGO handles your personal data." />
      <Container className="py-16 sm:py-24">
        <h1 className="text-4xl">Privacy</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Placeholder for the Privacy page. Content to follow.</p>
      </Container>
    </>
  );
}
