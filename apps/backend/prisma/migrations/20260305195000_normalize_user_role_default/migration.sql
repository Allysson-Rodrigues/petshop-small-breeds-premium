PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'client',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_User" ("id", "name", "email", "password", "role", "createdAt")
SELECT
  "id",
  "name",
  "email",
  "password",
  CASE
    WHEN "role" = 'user' THEN 'client'
    WHEN "role" IS NULL OR "role" = '' THEN 'client'
    ELSE "role"
  END AS "role",
  "createdAt"
FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
