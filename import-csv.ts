
import { db } from "./server/db";
import { canteenEntries } from "./shared/schema";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

async function main() {
  const csvPath = path.resolve(process.cwd(), "kantinuskrasetingCSV.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  console.log("Reading CSV file...");
  const fileContent = fs.readFileSync(csvPath, "utf-8");
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Found ${records.length} records. Starting import...`);

  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    try {
      // Map CSV columns to schema
      // CSV: Id,dato,Navn,Fyritoka,Maltid,NrOfPersons,Umbod
      
      // Parse date: "23-01-2024 13:13:20" -> Date object
      const [datePart, timePart] = record.dato.split(" ");
      const [day, month, year] = datePart.split("-");
      const [hour, minute, second] = timePart.split(":");
      
      const createdAt = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );

      await db.insert(canteenEntries).values({
        name: record.Navn,
        company: record.Fyritoka,
        meal: record.Maltid,
        amount: record.NrOfPersons, // Will be cast to decimal automatically or string
        representative: record.Umbod,
        createdAt: createdAt,
        invoiceShipped: false, // Default
      });

      successCount++;
      if (successCount % 10 === 0) {
        process.stdout.write(`\rImported ${successCount} records...`);
      }
    } catch (error) {
      console.error(`\nFailed to import record: ${JSON.stringify(record)}`);
      console.error(error);
      errorCount++;
    }
  }

  console.log(`\n\nImport finished!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
