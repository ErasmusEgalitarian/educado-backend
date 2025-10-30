import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronLeft, Trash2, Edit3 } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Button } from "@/shared/components/shadcn/button";
import { Card, CardContent, CardHeader} from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";

interface CourseEditorSectionsProps {
  courseId?: string;
  onComplete?: () => void;
  onGoBack?: () => void;
}

export interface CourseEditorSectionsRef {
  isDirty: () => boolean;
}

/* --------------------------------- Schema --------------------------------- */
const sectionSchema = z.object({
  title: z.string().min(1, "common.required"),
  description: z.string().optional(),
  sectionType: z.enum(["Lesson", "Exercise"]),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export interface Section {
  id: string;
  title: string;
  description?: string;
}

const CourseEditorSections = forwardRef<
  CourseEditorSectionsRef,
  CourseEditorSectionsProps
>(({ courseId, onComplete, onGoBack }, ref) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<Section[]>([]);
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
    console.log("FORM SUBMITTED!", { currentSectionEditing, values });
    
    if (currentSectionEditing) {
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
    console.log("Editing section:", section.id);
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

  return (
    <div className="flex flex-col gap-y-6">
      <Card className="p-0 shadow-none">
        <CardContent className="space-y-6 p-0">
          {/* Sections List */}
          {sections.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-greyscale-text-title">
                {t("courseManager.section")} ({sections.length})
              </h3>
              {sections.map((section, index) => (
                <Card
                  key={section.id}
                  className={`p-4 ${
                    currentSectionEditing === section.id 
                      ? "border-primary border-2" 
                      : "border-greyscale-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-greyscale-text-caption bg-greyscale-bg-hover px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-greyscale-text-title">
                            {section.title}
                          </h4>
                        </div>
                        {section.description && (
                          <p className="text-greyscale-text-body text-sm">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(section)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(section.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add/Edit Section Form */}
          {showForm && (
            <Card className="border border-primary-surface-default pt-0 overflow-hidden">
              <CardHeader className="bg-primary-surface-default p-6 text-white font-bold">
                {isEditing ? t("courseManager.editSection") : t("courseManager.createNewSection")}
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          onClick={() => console.log("Add lesson")}
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
                          onClick={() => console.log("Add exercise")}
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
                      <Button type="submit"> {/* FIXED: Added type="submit" */}
                        {isEditing ? t("common.update") : t("common.create")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Add Section Button */}
          {!showForm && (
            <Button
              onClick={startCreating}
              className="w-full border-dashed"
              variant="outline"
            >
              <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
              {t("courseManager.addSection")}
            </Button>
          )}

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
                onClick={() => onComplete?.()}
                className="text-destructive font-bold underline"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => onComplete?.()}
                disabled={sections.length === 0}
              >
                {t("courseManager.createAndContinue")} 
                {sections.length > 0 && ` (${sections.length})`}
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