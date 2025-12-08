import { Plus, ChevronLeft, ChevronDown, Trash2, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/shadcn/button";
import { Card, CardContent, CardHeader} from "@/shared/components/shadcn/card";
import { 
  CourseSectionCreateFunction,
  CourseSectionDeleteFunction, 
  CourseSectionQueryFunction, 
  CourseSectionSetPublish, 
  CourseSectionUpdateFunction } from "@/course/api/course-sections-api";
import { useQuery } from "@tanstack/react-query";
import { CourseSection } from "@/shared/api/types.gen";
import { Input } from "@/shared/components/shadcn/input";
import GlobalLoader from "@/shared/components/global-loader";

interface CourseEditorSectionsProps {
  courseId: string;
  onComplete?: () => void;
  onGoBack?: () => void;
}

const CourseEditorSections = ({ courseId, onComplete, onGoBack }: CourseEditorSectionsProps) => {
  const { t } = useTranslation();
  const [currentSectionEditing, setCurrentSectionEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSection, setNewSection] = useState<CourseSection>({title: ""});

  const createMutation = CourseSectionCreateFunction();
  const updateMutation = CourseSectionUpdateFunction();
  const deleteMutation = CourseSectionDeleteFunction();
  const setPublishMutation = CourseSectionSetPublish();
  
  const {
    data: queryCourseSections,
    isLoading: queryIsLoading,
    refetch,
  } = useQuery({
    ...CourseSectionQueryFunction(courseId ?? ""),
    enabled: true,
  });
  const [sections, setSections] = useState<Array<CourseSection> | undefined>();

  // Update course sections
  useEffect(() => {
    const run = () => {
      refetch().then(() => {
        setSections([...(queryCourseSections) ?? []]);
      });
    };
    run();
  }, [currentSectionEditing, isCreating, queryIsLoading]);
  
  
  const updateSection = async(section: CourseSection) => {    
    if (currentSectionEditing === null) return;

    try {
      await updateMutation.mutateAsync(section);
    } catch (error) {
      throw new Error(`Unable to get course sections, try reloading the page`);
    } finally {  
      await refetch().then(() => {
        setSections([...(queryCourseSections) ?? []]);
      });
      setIsCreating(false);
      setCurrentSectionEditing(null);
    }
  };

  const createSection = async (section: CourseSection) => {
    try {
      await createMutation.mutateAsync({
        ...section,
        courseId: courseId,
      });
    } catch(error) {
      throw new Error(`Unable to create course sections, try reloading the page and try again`);
    } finally {
      await refetch().then(() => {
        setSections([...(queryCourseSections) ?? []]);
      });
      setIsCreating(false);
      setCurrentSectionEditing(null);
    }
  }


  const handleDelete = async (sectionId: string | undefined) => {
    if(!sectionId) return;

    try {
      await deleteMutation.mutateAsync(sectionId);
    } catch(error) {
      throw new Error(`Unable to delete course sections, try reloading the page and try again`);
    } finally {
      await refetch().then(() => {
        setSections([...(queryCourseSections) ?? []]);
      });
      setIsCreating(false);
      setCurrentSectionEditing(null);
    }

  };

  return (
    <div className="flex flex-col gap-y-6">
      <Card className="p-0 shadow-none" >
        <CardContent className="space-y-6 p-0">
          {/* Sections List */}
          {(sections?.length ?? 0) > 0 && (
            <div className="space-y-4">
              {sections && sections?.map((section, index) => (
                <Card
                  key={section.id}
                  className={`p-0 rounded-sm`}
                >
                  <Button
                    variant="ghost"
                    className={`flex items-center justify-between p-10 ${
                      currentSectionEditing === section.documentId 
                        ? "border-primary border-2" 
                        : "border-greyscale-border"
                    }`}
                    onClick={() => { () => {
                      if (currentSectionEditing !== section.documentId) {
                        setCurrentSectionEditing(section.documentId ?? null);
                        setIsCreating(false);
                        return;
                      }

                      setCurrentSectionEditing(null);
                      setIsCreating(false);
                    }}}
                  >
                    <div className="flex items-center">
                      <h4 className="h-full flex items-center gap-3 font-semibold text-greyscale-text-title">
                        <ChevronDown size={16} className="hover:cursor-pointer"/>
                        {t("courseEditor.section")} {index + 1}{": "} {section.title}
                      </h4>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { handleDelete(section.documentId) }}
                        className="text-white hover:text-white rounded-full bg-primary-surface-darker border-none"

                      >
                        <Trash2 size={16} />
                      </Button>
                       <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { console.log("TODO: make draggable")}}
                        className="text-white hover:text-white rounded-full bg-primary-surface-darker border-none"
                      >
                        <Menu size={16} />
                      </Button>
                    </div>
                  </Button>
                  {(currentSectionEditing == section.documentId) && (
                    <Card className="rounded-sm border border-primary-surface-default pt-0 overflow-hidden">
                      <CardHeader className="bg-primary-surface-default p-6 text-white font-bold">
                        {t("courseEditor.editSection")}
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <p className="font-bold">
                              {t("common.name")} <span className="text-red-500">*</span>
                            </p>
                            <Input
                              onChange={(event) => {
                                setSections(sections.map(section => (section.documentId == currentSectionEditing ? {...section, title: event.target.value} : section)))
                              }}
                              value = {section.title || ""}
                              label={t("common.name")}
                              placeholder={t("common.name")}
                            />


                            <p className="font-bold">
                              {t("courseEditor.description")} <span className="text-red-500">*</span>
                            </p>
                            <Input
                              onChange={(event) => {
                                setSections(sections.map(section => (section.documentId == currentSectionEditing ? {...section, description: event.target.value} : section)))
                              }}
                              value = {section.description || ""}
                              label={t("courseEditor.description")}
                              placeholder={t("courseEditor.descriptionPlaceholder")}
                            />
      
                            <hr />
                            <div className="grid grid-cols-[1fr_25px_1fr] gap-2">
                              <Button
                                type="button"
                                onClick={() => { console.log("Add lesson") }}
                                className="w-full border-dashed"
                                variant="outline"
                              >
                                <div className="w-full flex flex-row items-center justify-center">
                                  <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
                                  {t("courseEditor.addLesson")}
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
                                  {t("courseEditor.addExercise")}
                                </div>
                              </Button>
                            </div>
                          </div>
      
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                
                              }}
                            >
                              {t("common.cancel")}
                            </Button>
                            <Button onClick={() => {
                              updateSection(section);
                              setNewSection({ // reset for next section creation
                                title: "",
                                description: "",
                                activities: undefined,
                              })
                            }}>
                              {t("common.update")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Card>
              ))}
            </div>
          )}

          {isCreating && (
            <Card className="rounded-sm border border-primary-surface-default pt-0 overflow-hidden">
              <CardHeader className="bg-primary-surface-default p-6 text-white font-bold">
                { t("courseEditor.createNewSection")}
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <p className="font-bold">
                      {t("common.name")} <span className="text-red-500">*</span>
                    </p>
                    <Input
                      onChange={(event) => {
                        setNewSection({...newSection, title: event.target.value});
                      }}
                      label={t("common.name")}
                      placeholder={t("common.name")}
                    />

                    <p className="font-bold">
                      {t("courseEditor.description")} <span className="text-red-500">*</span>
                    </p>
                    <Input
                      onChange={(event) => {
                        setNewSection({...newSection, description: event.target.value});
                      }}
                      label={t("courseEditor.description")}
                      placeholder={t("courseEditor.descriptionPlaceholder")}
                    />
                    <hr />
                    <div className="grid grid-cols-[1fr_25px_1fr] gap-2">
                      <Button
                        type="button"
                        onClick={() => { console.log("Add lesson") }}
                        className="w-full border-dashed"
                        variant="outline"
                      >
                        <div className="w-full flex flex-row items-center justify-center">
                          <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
                          {t("courseEditor.addLesson")}
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
                          {t("courseEditor.addExercise")}
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setCurrentSectionEditing(null);
                      }}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button onClick={() => createSection(newSection)}>
                      {t("common.create")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Section Button */}
          {!isCreating && (
            <Button
              onClick={() => {
                setIsCreating(true);
                setCurrentSectionEditing(null);
              }}
              className="w-full border-dashed"
              variant="outline"
            >
              <Plus size={16} className="mr-2 text-greyscale-text-disabled" />
              {t("courseEditor.addNewSection")}
            </Button>
          )}

          {queryIsLoading && (
            <GlobalLoader 
              variant="container"
              message={`${t("common.loading")} ${t("courses.course").toLowerCase()}...`}/>
          )}


          {/* Continue/Skip Actions */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-greyscale-border">
            <div className="col-start-1 gap-4 justify-start">
              <Button
                variant="blank"
                onClick={() => onGoBack?.()}
              >
                <ChevronLeft size={16} className="mr-2" />
                {t("courseEditor.goBack")}
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
                onClick={() => {
                  sections?.forEach((section) => {
                    setPublishMutation.mutateAsync(section);
                  });
                  onComplete?.()
                }}
                disabled={sections?.length === 0}
              >
                {t("courseEditor.createAndContinue")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

CourseEditorSections.displayName = "CourseEditorSections";

export default CourseEditorSections;