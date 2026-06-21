(() => {
  const labels = {
    all: "All",
    journal: "Journal",
    conference: "Conference",
  };

  const initializeFilters = () => {
    const groups = new Map();

    document.querySelectorAll(".publication-entry[data-publication-type]").forEach((entry) => {
      // The homepage's Recent Publications section is intentionally unfiltered.
      if (entry.closest("#papers")) return;

      const container = entry.parentElement;
      if (!container) return;
      if (!groups.has(container)) groups.set(container, []);
      groups.get(container).push(entry);
    });

    groups.forEach((entries, container) => {
      if (container.querySelector(":scope > .publication-filter")) return;

      const counts = {
        all: entries.length,
        journal: entries.filter((entry) => entry.dataset.publicationType === "journal").length,
        conference: entries.filter((entry) => entry.dataset.publicationType === "conference").length,
      };

      const toolbar = document.createElement("div");
      toolbar.className = "publication-filter";
      toolbar.setAttribute("role", "group");
      toolbar.setAttribute("aria-label", "Filter publications by type");

      const status = document.createElement("span");
      status.className = "publication-filter-status sr-only";
      status.setAttribute("aria-live", "polite");

      Object.keys(labels).forEach((filter) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "publication-filter-button";
        button.dataset.filter = filter;
        button.setAttribute("aria-pressed", filter === "all" ? "true" : "false");
        button.innerHTML = `<span>${labels[filter]}</span><span class="publication-filter-count">${counts[filter]}</span>`;

        button.addEventListener("click", () => {
          toolbar.querySelectorAll(".publication-filter-button").forEach((candidate) => {
            candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false");
          });

          let visible = 0;
          entries.forEach((entry) => {
            const matches = filter === "all" || entry.dataset.publicationType === filter;
            entry.hidden = !matches;
            if (matches) visible += 1;
          });
          status.textContent = `${visible} publications shown`;
        });

        toolbar.appendChild(button);
      });

      toolbar.appendChild(status);
      container.prepend(toolbar);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeFilters, { once: true });
  } else {
    initializeFilters();
  }
})();
