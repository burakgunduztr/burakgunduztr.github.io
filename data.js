/**
 * data.js
 *
 * Central file listing. To add a new PDF:
 *   1. Upload the .pdf file into the /pdfs/ folder.
 *   2. Add a new object to the `files` array below.
 *   3. Save. Done.
 *
 * Fields:
 *   category    — Group heading (string). Files with the same category are grouped.
 *   title       — Display name of the document (string).
 *   description — One-sentence summary shown beneath the title (string).
 *   file        — Relative path to the PDF, e.g. "pdfs/my-doc.pdf" (string).
 *   updated     — ISO date string "YYYY-MM-DD". Used for "last updated" label
 *                 and for sorting newest-first within each category.
 */

const files = [

  // ── Data Analysis ────────────────────────────────────────────────
  {
    category: "Data Analysis",
    title: "Understanding core principles of data analysis",
    description: "Short explanation of vectorization, normalization and outlier detections, including example Python code blocks and scientific formulas. It's also good for beginners in Python.",
    file: "pdfs/Vectorization-Normalization-OutliersDetection.pdf",
    updated: "2026-02-26"
  }

];
