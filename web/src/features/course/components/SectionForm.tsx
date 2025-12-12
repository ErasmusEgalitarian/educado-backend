/* eslint-disable unicorn/filename-case */
import { t } from "i18next";
import { Plus } from "lucide-react";
import { useState } from "react";

import { CourseSection } from "@/shared/api/types.gen";
import { Button } from "@/shared/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/shared/components/shadcn/card";
import { Input } from "@/shared/components/shadcn/input";


interface SectionFormProps {
    courseSection?: CourseSection,
    isEditing: boolean,
    handleCancel: (documentId: string | null) => void,
    updateOrCreateSection: (section: CourseSection) => Promise<void>,
}

export const SectionForm = ({ courseSection, isEditing, handleCancel, updateOrCreateSection }: SectionFormProps) => {
    
    const [section, setSection] = useState(courseSection ?? {title: ""});

    return (
        <Card className="rounded-sm border border-primary-surface-default pt-0 overflow-hidden">
            <CardHeader className="bg-primary-surface-default p-6 text-white font-bold">
            {isEditing ? t("courseEditor.editSection"): t("courseEditor.createNewSection")}
            </CardHeader>
            <CardContent className="pt-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                <p className="font-bold">
                    {t("common.name")} <span className="text-red-500">*</span>
                </p>
                <Input
                    onChange={(event) => {
                        setSection({... section, title: event.target.value});
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
                        setSection({...section, description: event.target.value})
                    }}
                    value = {section.description ?? ""}
                    label={t("courseEditor.description")}
                    placeholder={t("courseEditor.descriptionPlaceholder")}
                />

                <hr />
                    <div className="grid grid-cols-[1fr_25px_1fr] gap-2">
                        <Button
                        type="button"
                        // eslint-disable-next-line no-console
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
                        // eslint-disable-next-line no-console
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
                        handleCancel("");
                    }}
                >
                    {t("common.cancel")}
                </Button>
                <Button onClick={() => {
                    void updateOrCreateSection(section);
                }}>
                    {isEditing ? t("common.update") : t("common.create")}
                </Button>
                </div>
            </div>
            </CardContent>
        </Card>
    )
};

