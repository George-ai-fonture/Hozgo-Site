import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found" description="This page does not exist." />
      <Container className="py-24 text-center">
        <h1 className="text-4xl">This page does not exist.</h1>
        <p className="mt-4 text-muted-foreground">It may have moved, or the link may be wrong.</p>
        <Button asChild className="mt-8">
          <Link to="/">Back to the home page</Link>
        </Button>
      </Container>
    </>
  );
}
