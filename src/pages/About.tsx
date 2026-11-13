import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";

export default function About() {
  return (
    <>
      <PageMeta title="About" description="About HOZGO, the UK horse transport marketplace." />
      <Container className="py-16 sm:py-24">
        <h1 className="text-4xl">About</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Placeholder for the About page. Content to follow.</p>
      </Container>
    </>
  );
}
