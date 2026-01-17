(function watchBodyForTimeTags() {
  if (!document.body) {
    // In case this runs too early
    window.addEventListener("DOMContentLoaded", watchBodyForTimeTags, { once: true });
    return;
  }

  const processed = new WeakSet();

  function handleTimeElem(timeElem) {
    if (!(timeElem instanceof Element)) return;
    if (processed.has(timeElem)) return;
    processed.add(timeElem);

    const dateInTitle = timeElem.getAttribute("title");
    if (!dateInTitle) return;

    const date = new Date(dateInTitle);
    if (Number.isNaN(date.getTime())) return;

    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // If you want to replace the content inside <time>:
    timeElem.textContent = formatted;
  }

  // Process existing <time> tags already in the DOM
  document.querySelectorAll("time").forEach(handleTimeElem);

  // Watch for new nodes being added anywhere under <body>
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;

        // Node itself might be <time>
        if (node.tagName === "TIME") handleTimeElem(node);

        // Or it may contain <time> descendants
        node.querySelectorAll("time").forEach(handleTimeElem);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();