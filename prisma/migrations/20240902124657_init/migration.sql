-- CreateTable
CREATE TABLE "Blog" (
    "Blogid" SERIAL NOT NULL,
    "BlogContent" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "SubTitle" TEXT NOT NULL,
    "Author" TEXT NOT NULL,
    "Like" INTEGER NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("Blogid")
);

-- CreateTable
CREATE TABLE "comment" (
    "commentId" SERIAL NOT NULL,
    "CommentWritter" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "BlogId" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_BlogContent_key" ON "Blog"("BlogContent");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_BlogId_fkey" FOREIGN KEY ("BlogId") REFERENCES "Blog"("Blogid") ON DELETE RESTRICT ON UPDATE CASCADE;
