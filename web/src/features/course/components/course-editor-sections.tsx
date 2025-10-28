import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { Plus, GripVertical, Trash2, Edit3 } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { Button } from "@/shared/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/shadcn/card";
import { Form } from "@/shared/components/shadcn/form";

interface CourseEditorSectionsProps {
  courseId?: string;
  onComplete?: () => void;
}

export interface CourseEditorSectionsRef {
  isDirty: () => boolean;
}

/* --------------------------------- Schema --------------------------------- */
const sectionSchema = z.object({
  title: z.string().min(1, "validation.required"),
  description: z.string().optional(),
  sectionType: z.enum(["Lesson", "Exercise"]),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export interface Section {
  id: string;
  title: string;
  description?: string;
  sectionType: "Lesson" | "Exercise";
  // Future attributes can be added here for Lesson and Exercise specific fields
}

const CourseEditorSections = forwardRef<
  CourseEditorSectionsRef,
  CourseEditorSectionsProps
>(({ courseId, onComplete }, ref) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<Section[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
      sectionType: "Lesson",
    },
    mode: "onTouched",
  });

  // Track form dirty state
  useImperativeHandle(ref, () => ({
    isDirty: () => form.formState.isDirty || sections.length > 0,
  }));

  const onSubmit = (values: SectionFormValues) => {
    if (isEditing) {
      // Update existing section
      setSections(prev => prev.map(section => 
        section.id === isEditing 
          ? { ...section, ...values }
          : section
      ));
      setIsEditing(null);
    } else {
      // Create new section
      const newSection: Section = {
        id: `section-${Date.now()}`,
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
      description: section.description || "",
      sectionType: section.sectionType,
    });
    setIsEditing(section.id);
    setIsCreating(false);
  };

  const handleDelete = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    if (isEditing === sectionId) {
      setIsEditing(null);
      form.reset();
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    form.reset();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <CardContent className="space-y-6">
          {/* Sections List */}
          {sections.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-greyscale-text-title">
                {t("courseManager.sections")} ({sections.length})
              </h3>
              {sections.map((section, index) => (
                <Card
                  key={section.id}
                  className={`p-4 ${
                    isEditing === section.id 
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
                          <span className="text-sm font-medium text-greyscale-text-caption bg-primary/10 text-primary px-2 py-1 rounded">
                            {section.sectionType}
                          </span>
                          <h4 className="font-semibold text-greyscale-text-title">
                            {section.title}
                          </h4>
                        </div>
                        
                        {section.description ? (
                          <p className="text-greyscale-text-body text-sm">
                            {section.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { handleEdit(section); }}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { handleDelete(section.id); }}
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
          {(isCreating || isEditing) && (
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <FormInput
                        control={form.control}
                        fieldName="title"
                        label={t("courseManager.sectionTitle")}
                        placeholder={t("courseManager.sectionTitlePlaceholder")}
                        isRequired
                      />
                      
                      <FormSelect
                        control={form.control}
                        fieldName="sectionType"
                        label={t("courseManager.sectionType")}
                        options={[
                          { label: t("courseManager.lesson"), value: "Lesson" },
                          { label: t("courseManager.exercise"), value: "Exercise" },
                        ]}
                        isRequired
                      />
                      
                      <FormTextarea
                        control={form.control}
                        fieldName="description"
                        label={t("courseManager.sectionDescription")}
                        placeholder={t("courseManager.sectionDescriptionPlaceholder")}
                        rows={3}
                      />
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
                        {isEditing ? t("common.update") : t("common.add")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Add Section Button */}
          {!isCreating && !isEditing && (
            <Button
              onClick={() => {
                setIsCreating(true);
                setIsEditing(null);
                form.reset();
              }}
              className="w-full border-dashed"
              variant="outline"
            >
              <Plus size={16} className="mr-2" />
              {t("courseManager.addSection")}
            </Button>
          )}

          {/* Continue/Skip Actions */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-greyscale-border">
            <div className="col-start-1 gap-4 justify-start">
              <Button
                variant="blank"
                onClick={() => onComplete?.()}
              > 
                {t("common.back")}
              </Button>
            </div>
            <div className="col-start-4 flex gap-4 justify-end right-auto">
              <Button
                variant="blank"
                onClick={() => onComplete?.()}
                className="text-red-500 font-bold underline"
              >
                {t("courseEditor.skipToReview")}
              </Button>
              <Button
                onClick={() => onComplete?.()}
                disabled={sections.length === 0}
              >
                {t("common.continue")} {sections.length > 0 && `(${sections.length})`}
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