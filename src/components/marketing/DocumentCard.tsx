import { FileCheck2 } from "lucide-react";
import type { DocumentInfo } from "./documents";

export function DocumentCard({ doc }: { doc: DocumentInfo }) {
  return (
    <article className="card-premium flex h-full flex-col p-6">
      <FileCheck2 className="mb-4 h-5 w-5 text-gunmetal-500" aria-hidden="true" />
      <h3 className="text-lg">{doc.label}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{doc.what}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">A good upload</dt>
          <dd className="mt-1">{doc.good}</dd>
        </div>
        {doc.watch && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Watch for</dt>
            <dd className="mt-1">{doc.watch}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
