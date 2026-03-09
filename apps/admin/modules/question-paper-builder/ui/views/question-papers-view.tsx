"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Trash2,
  Settings,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

import {
  useQuestionPapers,
  useDeleteQuestionPaper,
} from "@workspace/api-client";

interface QuestionPaperListItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  examName: string;
  total: number;
  timeInMinutes: number;
  academicClass?: { name: string; displayName: string };
  academicChapter?: { name: string; displayName: string };
  questionPaperSubjects?: {
    subject: { name: string; displayName: string };
  }[];
  _count?: { questions: number };
}

export const QuestionPapersView = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const { data: papers, isLoading } = useQuestionPapers({
    search: debouncedSearch,
  });
  const { mutateAsync: deletePaper } = useDeleteQuestionPaper();
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePaper({ id: deleteTarget.id });
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredPapers = (papers?.items || []) as QuestionPaperListItem[];

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers..."
              className="pl-9 h-11 bg-background/50 border-border/50 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => router.push("/question-papers/new")}
            className="w-full md:w-auto h-11 px-6 bg-primary text-primary-foreground rounded-xl shadow-glow font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[3]" />
            Create New Paper
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-[2rem] bg-muted/20 border border-border/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="size-20 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground">
              <FileText className="size-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No papers found</h3>
              <p className="text-muted-foreground max-w-xs">
                Start by creating your first question paper and choosing
                questions from the bank.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/question-papers/new")}
              className="rounded-xl font-bold"
            >
              Create Paper
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper, idx) => (
              <Card
                key={paper.id}
                className="group bg-card/30 backdrop-blur-xl border-border/50 rounded-[2rem] overflow-hidden shadow-medium transition-all duration-300 hover:shadow-large hover:border-primary/20 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${idx * 60}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-black line-clamp-1">
                        {paper.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            paper.status === "Published"
                              ? "default"
                              : "secondary"
                          }
                          className="rounded-lg font-bold text-[10px] uppercase tracking-wider"
                        >
                          {paper.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(paper.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/question-papers/${paper.id}/customize`,
                            )
                          }
                          className="rounded-lg font-medium"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Builder
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-medium">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteTarget({
                              id: paper.id,
                              title: paper.title,
                            })
                          }
                          className="rounded-lg font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-background/50 rounded-2xl border border-border/50 flex flex-col justify-center gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          Category
                        </span>
                      </div>
                      <span className="text-sm font-bold truncate">
                        {paper.questionPaperSubjects &&
                        paper.questionPaperSubjects.length > 0
                          ? paper.questionPaperSubjects
                              .map((s) => s.subject.displayName)
                              .join(", ")
                          : "Uncategorized"}
                      </span>
                    </div>
                    <div className="p-3 bg-background/50 rounded-2xl border border-border/50 flex flex-col justify-center gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          Questions
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {paper._count?.questions || 0} items
                      </span>
                    </div>
                  </div>
                  {paper.academicClass && (
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Badge variant="outline" className="rounded-md font-bold">
                        {paper.academicClass.displayName}
                      </Badge>
                      <span className="truncate">{paper.examName}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                  <Button
                    onClick={() =>
                      router.push(`/question-papers/${paper.id}/customize`)
                    }
                    className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold rounded-xl transition-all h-10 border-none"
                  >
                    Edit Paper
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-black">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Question Paper?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span>
                This action cannot be undone. This will permanently delete:
              </span>
              <span className="block p-3 bg-muted/50 rounded-xl text-sm font-bold text-foreground border">
                {deleteTarget?.title}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
            >
              Delete Paper
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
