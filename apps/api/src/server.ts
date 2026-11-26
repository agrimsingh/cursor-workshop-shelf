import { createServer } from "node:http";
import { openDb } from "@shelf/db";
import { buildApp } from "./app";

const PORT = Number(process.env.PORT ?? 4000);
const db = openDb(new URL("../../../data/shelf.db", import.meta.url).pathname);

createServer(buildApp(db)).listen(PORT, () => {
  console.log(`Shelf API ready at http://localhost:${PORT}/graphql`);
});
