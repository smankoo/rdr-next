-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "pubDate" DATETIME NOT NULL,
    "feedId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "author" TEXT,
    CONSTRAINT "Article_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("author", "createdAt", "description", "feedId", "id", "imageUrl", "isRead", "link", "pubDate", "title", "updatedAt") SELECT "author", "createdAt", "description", "feedId", "id", "imageUrl", "isRead", "link", "pubDate", "title", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_feedId_link_key" ON "Article"("feedId", "link");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
