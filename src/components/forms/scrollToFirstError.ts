/** After a failed submit, bring the first inline error (in page order) into view and focus its control. */
export function scrollToFirstError(root: HTMLElement | null = document.body) {
  // Wait for React to paint the new error state before looking for it.
  window.setTimeout(() => {
    const scope = root ?? document.body;
    const invalid = scope.querySelector<HTMLElement>('[aria-invalid="true"]');
    const target = invalid ?? scope.querySelector<HTMLElement>("[data-error]");
    if (!target) return;
    const field = target.closest<HTMLElement>("[data-field]") ?? target;
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = target.matches("input,select,textarea,button")
      ? target
      : target.querySelector<HTMLElement>("input,select,textarea,button");
    focusable?.focus({ preventScroll: true });
  }, 60);
}
