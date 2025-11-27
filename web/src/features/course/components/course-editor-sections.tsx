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
  courseSectionsId?: Array<{ id?: number, documentId?: string }> | undefined;
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
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

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
      {/* MODALS */}
      {isAddingLesson ? (
        <div className="flex items-center justify-center w-screen h-screen bg-black/50 absolute fixed inset-0 z-[99]">
          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto max-w-[800px]">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-semibold text-gray-800">{t("courseManager.addLesson")}</h2>
              {/* Close Button */}
              <button className="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer" 
                      onClick={() => { setIsAddingLesson(false); setIsAddingText(false); setIsAddingVideo(false); }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className="p-6 space-y-6">             
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("common.name")}
                </label>
                <input 
                  type="text" 
                  placeholder={t("courseManager.nameOfLesson")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {/* Radio Buttons */}
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t("courseManager.typeOfContent")}
              </label>
              <div className="flex gap-5">
                <label className="flex items-center">
                  <input type="radio" name="fileinput" value="video" className="text-blue-600 focus:ring-blue-500"
                    onChange={() => { setIsAddingVideo(true); setIsAddingText(false) }}
                  />
                  <span className="ml-2 text-gray-700">{t("files.video")}</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="fileinput" value="text" className="text-blue-600 focus:ring-blue-500"
                    onChange={() => { setIsAddingVideo(false); setIsAddingText(true) }}
                  />
                  <span className="ml-2 text-gray-700">{t("files.text")}</span>
                </label>
              </div>

              <hr />
    
              {isAddingText ? (
                <>
                {/* Textarea 1 */}
                <div>
                  <label className="block text-m font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea 
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                    maxLength={270}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    <span>{description.length}</span>/270 characters
                  </div>
                </div>

                {/* Textarea 2 */}
                <div>
                  <label className="block text-m font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea 
                    placeholder="Enter notes"
                    maxLength={270}
                    value={notes}
                    onChange={(e) => { setNotes(e.target.value) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    <span>{notes.length}</span>/270 characters
                  </div>
                </div>
                </>
              ) : null}

              {isAddingVideo ? (
                <h1>TODO</h1>
              ) : null}
              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-greyscale-border">
                <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="blank"
                          onClick={() => { setIsAddingLesson(false) }}
                          className="text-destructive font-bold underline"
                        >
                          {t("common.cancel")}
                        </Button>
                  </div>
                  <div className="col-start-4 flex gap-4 justify-end">
                        <Button
                          onClick={() => console.log("submitted text block")}
                        >
                          {t("courseManager.addLesson")}
                        </Button>
                  </div>
                </div>
              </div> 
            </div>
          </div>
      ) : null}

      <Card className="p-0 shadow-none">
        <CardContent className="space-y-6 p-0">
          {/* Sections List */}
          {sections.length > 0 ? (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <Card
                  key={section.id}
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
                        onClick={() => { handleDelete(section.id) }}
                        className="text-white hover:text-white rounded-full bg-primary-surface-darker border-none"

                      >
                        <Trash2 size={16} />
                      </Button>
                       <Button
                        variant="secondary"
                        size="default"
                        onClick={() => { console.log("TODO: make draggable")}}
                        className="text-white hover:text-white rounded-full bg-primary-surface-darker border-none"
                      >
                        <Menu size={16} />
                      </Button>
                    </div>
                  </Button>
                </Card>
              ))}
            </div>
          ): null}

          {/* Add/Edit Section Form */}
          {showForm ? (
            <Card className="rounded-sm border border-primary-surface-default pt-0 overflow-hidden">
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
                          onClick={() => { setIsAddingLesson(true)}}
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
                          onClick={() => { console.log("Add exercise")}}
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
          ): null}

          {/* Add Section Button */}
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