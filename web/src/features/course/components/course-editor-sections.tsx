import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronLeft, ChevronDown, Trash2, Menu } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Button } from "@/shared/components/shadcn/button";
import { Card, CardContent, CardHeader} from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";

interface CourseEditorSectionsProps {
  courseSectionsId?: { id: string, title: string, documentId: string }[];
  onComplete?: () => void;
  onGoBack?: () => void;
}

export interface CourseEditorSectionsRef {
  isDirty: () => boolean;
}

/* --------------------------------- Schema --------------------------------- */
const sectionSchema = z.object({
  title: z.string().min(1, "This field is required"),
  description: z.string().optional(),
  sectionType: z.enum(["Lesson", "Exercise"]),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export interface Section {
  id: string;
  title: string;
  description?: string;
}

const CourseEditorSections = forwardRef<CourseEditorSectionsRef, CourseEditorSectionsProps>(({ courseSectionsId, onComplete, onGoBack }, ref) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState(courseSectionsId ?? []); // incorrect btw
  const [currentSectionEditing, setCurrentSectionEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
      sectionType: "Lesson",
    },
    mode: "onChange", // Better for real-time validation
  });

  // Track form dirty state
  useImperativeHandle(ref, () => ({
    isDirty: () => form.formState.isDirty || sections.length > 0,
  }));

  const generateSectionId = () => Date.now().toString();

  const onSubmit = (values: SectionFormValues) => {

    if (currentSectionEditing != null) {
      // Update existing section
      setSections(prev => prev.map(section =>
        section.id === currentSectionEditing
          ? { ...section, ...values }
          : section
      ));
      setCurrentSectionEditing(null);
    } else {
      // Create new section
      const newSection: Section = {
        id: generateSectionId(),
        ...values,
      };
      setSections(prev => [...prev, newSection]);
      setIsCreating(false);
    }

    form.reset();
  };

  const handleEdit = (section: Section) => {
    form.reset({
      title: section.title,
      description: section.description ?? "",
      sectionType: "Lesson",
    });
    setCurrentSectionEditing(section.id);
    setIsCreating(false);
  };

  const handleDelete = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    if (currentSectionEditing === sectionId) {
      setCurrentSectionEditing(null);
      form.reset();
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setCurrentSectionEditing(null);
    form.reset();
  };

  const startCreating = () => {
    form.reset();
    setIsCreating(true);
    setCurrentSectionEditing(null);
  };

  const isEditing = currentSectionEditing !== null;
  const showForm = isCreating || isEditing;

  const SectionCard = ({ section, index }: { section: Section; index: number }) => (
    <Card
      className={`p-0 rounded-sm ${
        currentSectionEditing === section.id 
          ? "border-primary border-2" 
          : "border-greyscale-border"
      }`}
    >
      <Button
        variant="ghost"
        className="flex items-center justify-between p-10"
        onClick={() => { handleEdit(section) }}
      >
        <div className="flex items-center">
          <h4 className="h-full flex items-center gap-3 font-semibold text-greyscale-text-title">
            <ChevronDown size={16} className="hover:cursor-pointer"/>
            {t("courseManager.section")} {index + 1}{":"} {section.title}
          </h4>
        </div>

        <div className="flex gap-2 ml-4">
          <Button
            variant="secondary"
            size="default"
            onClick={(e) => { 
              e.stopPropagation(); 
              handleDelete(section.id) }}
            className="text-white hover:text-white rounded-full bg-primary-surface-darker border-none"

          >
            <Trash2 size={16} />
          </Button>

          <Button
            variant="secondary"
            size="default"
            onClick={(e) => { 
              e.stopPropagation();
            }}
            className="text-white hover:text-white rounded-full bg-primary-surface-darker border-none"
          >
            <Menu size={16} />
          </Button>
        </div>
      </Button>
    </Card>
  );

  interface EditSectionFormProps {
    sectionIndex?: number;
    sectionTitle?: string;
    isCreatingNew?: boolean;
  }

  const EditSectionForm = ({ sectionIndex, sectionTitle, isCreatingNew = false }: EditSectionFormProps) => {
    // Get the section number display text
    // const getSectionNumberText = () => {
    //   if (isCreatingNew) {
    //     return t("courseManager.createNewSection");
    //   }
    //   return `${t("courseManager.section")} ${sectionIndex?.toString() ?? "0"}: ${sectionTitle ?? ""}`;
    // };

    return (
      <Card className="rounded-sm border border-primary-surface-default pt-0 overflow-hidden">
        <CardHeader className="bg-primary-surface-default p-6 text-white font-bold">
          {isCreatingNew ? t("courseManager.createNewSection") : t("courseManager.editSection")+` ${sectionIndex?.toString() ?? "0"}: ${sectionTitle ?? ""}`}
        </CardHeader>
        <CardContent className="pt-6">
          {/* Section number and title display */}

          
          <Form {...form}>
            <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormInput
                  control={form.control}
                  fieldName="title"
                  label={t("common.name")}
                  placeholder={t("common.name")}
                  isRequired
                />

                <FormTextarea
                  control={form.control}
                  fieldName="description"
                  label={t("courseManager.description")}
                  placeholder={t("courseManager.descriptionPlaceholder")}
                  rows={3}
                />

                <hr />

                <div className="grid grid-cols-[1fr_25px_1fr] gap-2">
                  <Button
                    type="button"
                    className="w-full border-dashed"
                    variant="outline"
                  >
                    <div className="w-full flex flex-row items-center justify-center">
                      <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
                      {t("courseManager.addLesson")}
                    </div>
                  </Button>
                  <span className="flex items-center justify-center text-greyscale-text-disabled">
                    {t("common.or")}
                  </span>
                  <Button
                    type="button"
                    className="w-full border-dashed flex"
                    variant="outline"
                  >
                    <div className="w-full flex flex-row items-center justify-center">
                      <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
                      {t("courseManager.addExercise")}
                    </div>
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit">
                  {isEditing ? t("common.update") : t("common.create")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  return (
   <div className="flex flex-col gap-y-6">
      <Card className="p-0 shadow-none">
        <CardContent className="space-y-6 p-0">
          {/* Sections List */}
          {sections.length > 0 ? (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id}>
                  {currentSectionEditing === section.id ? (
                    <EditSectionForm 
                      sectionIndex={index}
                      sectionTitle={section.title}
                    />
                  ) : (
                    <SectionCard section={section} index={index} />
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {/* Add Section Form (for creating new sections) */}
          {isCreating ? (
            <div className="space-y-4">
              <EditSectionForm isCreatingNew={true} />
            </div>
          ) : null}

          {/* Add Section Button (only show when not editing or creating) */}
          {!showForm ? (
            <Button
              onClick={startCreating}
              className="w-full border-dashed"
              variant="outline"
            >
              <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
              {t("courseManager.addNewSection")}
            </Button>
          ) : null}

          {/* Continue/Skip Actions */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-greyscale-border">
            <div className="col-start-1 gap-4 justify-start">
              <Button
                variant="blank"
                onClick={() => onGoBack?.()}
              >
                <ChevronLeft size={16} className="mr-2" />
                {t("courseManager.goBack")}
              </Button>
            </div>
            <div className="col-start-4 flex gap-4 justify-end">
              <Button
                variant="blank"
                onClick={() => onGoBack?.()}
                className="text-destructive font-bold underline"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => onComplete?.()}
                disabled={sections.length === 0}
              >
                {t("courseManager.createAndContinue")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CourseEditorSections.displayName = "CourseEditorSections";

export default CourseEditorSections;