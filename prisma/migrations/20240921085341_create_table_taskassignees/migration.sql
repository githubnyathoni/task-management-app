-- CreateTable
CREATE TABLE "taskassignees" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "taskassignees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "taskassignees_taskId_userId_key" ON "taskassignees"("taskId", "userId");

-- AddForeignKey
ALTER TABLE "taskassignees" ADD CONSTRAINT "taskassignees_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskassignees" ADD CONSTRAINT "taskassignees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
