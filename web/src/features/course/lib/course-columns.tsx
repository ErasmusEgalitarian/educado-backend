import { type CellContext, type ColumnDef } from "@tanstack/react-table";
import { BookOpen, MoreHorizontal, Star, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

import { Course, CourseCategory } from "@/shared/api/types.gen";
import { Badge } from "@/shared/components/shadcn/badge";
import { Button } from "@/shared/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/dropdown-menu";

import { difficultyToTranslation } from "./difficulty-to-translation";

interface CoursesColumnsProps {
  t: (key: string) => string;
  navigate: (path: string) => void;
}

export const createCourseColumns = ({
  t,
  navigate,
}: CoursesColumnsProps): ColumnDef<Course>[] => {
  return [
    {
      accessorKey: "documentId",
      header: "ID",
      cell: ({ row }) => {
        const course = row.original;
        return <span className="font-mono text-sm">{course.documentId}</span>;
      },
      meta: {
        sortable: true,
        filterable: true,
        visibleByDefault: false,
      },
    },
    {
      accessorKey: "publishedAt",
      header: t("common.status"),
      cell: ({ row }) => {
        const publishedAt = row.getValue<string | null>("publishedAt");
        const isDraft = publishedAt === null;
        return (
          <Badge variant={isDraft ? "outline" : "default"}>
            {isDraft ? t("common.draft") : t("common.published")}
          </Badge>
        );
      },
      // Pass-through filter: always returns true because actual filtering
      // is done server-side via Strapi's status parameter (handled in usePaginatedData)
      filterFn: () => true,
      meta: {
        sortable: true,
        filterable: true,
        visibleByDefault: true,
        quickFilter: {
          type: "select",
          displayType: { where: "both", when: "both" },
          label: t("common.status"),
          options: [
            { label: t("common.draft"), value: "draft" },
            { label: t("common.published"), value: "published" },
          ],
        },
      },
    },
    {
      accessorKey: "title",
      header: t("courseManager.courseName"),
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">{course.title}</span>
          </div>
        );
      },
      meta: {
        sortable: true,
        filterable: true,
        visibleByDefault: true,
        quickFilter: {
          type: "text",
          displayType: { where: "both", when: "both" },
          label: t("courseManager.courseName"),
          placeholder: t("actions.search"),
        },
      },
    },
    {
      accessorKey: "difficulty",
      header: t("difficulty.difficulty"),
      cell: ({ row }) => {
        const value = row.getValue<string | undefined>("difficulty");
        return value != null && value !== "" ? (
          <Badge variant="outline">{difficultyToTranslation(t, value)}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      // Built-in filter: exact string equality for client-side filtering
      // This matches quick filter values ("1" | "2" | "3") exactly
      filterFn: "equalsString",
      meta: {
        sortable: true,
        filterable: true,
        visibleByDefault: true,
        quickFilter: {
          type: "select",
          displayType: { where: "both", when: "both" },
          label: t("difficulty.difficulty"),
          options: [
            { label: t("courseManager.beginner"), value: "1" },
            { label: t("courseManager.intermediate"), value: "2" },
            { label: t("courseManager.advanced"), value: "3" },
          ],
        },
      },
    },
    // Categories column: visible, renders badges, and filterable by names
    {
      id: "course_categories.name",
      header: t("categories.categories"),
      accessorFn: (row) => {
        const categories = row.course_categories ?? [];
        // Type assertion: at runtime, populated categories have a name property
        return categories
          .map((c) => (c as CourseCategory).name)
          .filter(Boolean);
      },
      cell: ({ row }) => {
        const course = row.original;
        const categories = (course.course_categories ?? []) as CourseCategory[];

        if (categories.length === 0) {
          return (
            <span className="text-muted-foreground">
              {t("categories.categoryNotFound")}
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="bg-[#c1cfd7] text-[#246670]"
              >
                {category.name}
              </Badge>
            ))}
            {categories.length > 2 ? (
              <Badge variant="outline">
                +{categories.length - 2} {t("common.more").toLowerCase()}
              </Badge>
            ) : null}
          </div>
        );
      },
      // Client-mode filtering: match if ANY category matches the value(s)
      filterFn: (row, _columnId, filterValue) => {
        const categories = (row.original.course_categories ??
          []) as CourseCategory[];
        const names = categories
          .map((c) => c.name)
          .filter(Boolean)
          .map((n) => n.toLowerCase());
        if (Array.isArray(filterValue)) {
          const lookup = new Set(
            (filterValue as unknown[]).map((v) => String(v).toLowerCase())
          );
          return names.some((n) => lookup.has(n));
        }
        if (typeof filterValue === "string") {
          const needle = filterValue.trim().toLowerCase();
          if (needle === "") return true;
          return names.some((n) => n.includes(needle));
        }
        return true;
      },
      meta: {
        sortable: false,
        filterable: true,
        visibleByDefault: true,
        quickFilter: {
          type: "text",
          displayType: { where: "toolbar", when: "both" },
          label: t("categories.categories"),
          placeholder: t("actions.search"),
        },
      },
    },
    {
      id: "rating",
      header: t("common.rating"),
      cell: () => {
        // Placeholder rating - you can replace this with actual rating data later
        const rating = 4.2;
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        );
      },
      meta: {
        sortable: true,
        filterable: false,
        visibleByDefault: true,
      },
    },
    {
      id: "actions",
      header: t("common.actions"),
      cell: ({ row }: CellContext<Course, unknown>) => {
        const documentId = row.original.documentId;

        const handleView = () => {
          toast.info("View course feature coming soon!");
        };

        const handleEdit = () => {
          if (documentId) {
            navigate(`/courses/${documentId}/edit`);
          }
        };

        const handleDelete = () => {
          toast.info(
            `Delete functionality is not implemented yet: ${documentId ?? "unknown"}`
          );
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t("common.openMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                {t("common.view")} {t("courseManager.course").toLowerCase()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit")} {t("courseManager.course").toLowerCase()}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                {t("common.delete")} {t("courseManager.course").toLowerCase()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      meta: {
        sortable: false,
        filterable: false,
        visibleByDefault: true,
      },
    },
  ];
};
