import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error("Usage: node inspect-workbook.mjs <workbook.xlsx>");
}

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const sheets = workbook.worksheets.items.map((sheet) => {
  const used = sheet.getUsedRange();
  const values = used?.values ?? [];
  const records = values
    .slice(1)
    .map((row, index) => ({ row: index + 2, values: row }))
    .filter(({ values: row }) => String(row[1] ?? "").trim())
    .map(({ row, values: v }) => ({
      row,
      authors: v[0],
      title: v[1],
      venue: v[2],
      ccf: v[3],
      cas: v[4],
      date: v[5],
      volumeIssue: v[6],
      pages: v[7],
      location: v[8],
      doi: v[9],
      ieeeCitation: v[10],
      gbCitation: v[11],
    }));
  return {
    name: sheet.name,
    address: used?.address ?? null,
    records,
  };
});

console.log(JSON.stringify({ sheets }, null, 2));
