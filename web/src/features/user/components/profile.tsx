import { zodResolver } from "@hookform/resolvers/zod";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import useAuthStore from "@/auth/hooks/useAuthStore";
import { contentCreatorGetContentCreatorsById, contentCreatorPutContentCreatorsById } from "@/shared/api/sdk.gen";
import { getBaseApiUrl, fetchHeaders } from "@/shared/config/api-config";

import GenericModalComponent from "../../../shared/components/GenericModalComponent";
import Layout from "../../../shared/components/Layout";
import { useApi } from "../../../shared/hooks/useAPI";
import dynamicForms from "../../../unplaced/dynamicForms";
import AccountServices from "../../../unplaced/services/account.services";
import ProfileServices from "../../../unplaced/services/profile.services";
import staticForm from "../../../shared/components/form/staticForm";

import AcademicExperienceForm from "./academic-experience-form";
import PersonalInformationForm from "./PersonalInformation";
import ProfessionalExperienceForm from "./ProfessionalExperience";
import { useFileUpload } from "@/features/media/hooks/use-file-upload"; 

// TypeScript Interfaces
interface ContentCreator {
  documentId: string;
  firstName: string;
  lastName?: string;
  email: string;
  biography?: string;
  education?: string;
  statusValue?: "PENDING" | "APPROVED" | "REJECTED";
  courseExperience: string;
  institution: string;
  eduStart: string;
  eduEnd: string;
  currentCompany: string;
  currentJobTitle: string;
  companyStart: string;
  verifiedAt?: string;
  profilePicture?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: Record<string, unknown>;
    hash: string;
    ext?: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
  };
}

// Zod Schema
const profileSchema = z.object({
  userName: z.string().optional(),
  userEmail: z.string().email("You need a suitable email to submit").optional(),
  bio: z.string().optional(),
  linkedin: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
      "Invalid LinkedIn URL"
    )
    .optional()
    .or(z.literal("")),
});

// Infer type from Zod schema
type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const {
    handleCharCountBio,
    formData,
    setFormData,
    handleInputChange,
  } = staticForm();

  const { emptyAcademicObject, emptyProfessionalObject } = tempObjects();

  const {
    userID,
    experienceErrors,
    educationErrors,
    handleExperienceInputChange,
    handleCountExperience,
    handleExperienceDelete,
    addNewExperienceForm,
    handleEducationDelete,
    addNewEducationForm,
    handleEducationInputChange,
    experienceFormData,
    educationFormData,
    fetchDynamicData,
    handleCheckboxChange,
  } = dynamicForms();

  // File upload hook
  const { uploadFile } = useFileUpload();

  // Image click
  const myRef = useRef<HTMLInputElement>(null);
  const imageClick = () => {
    myRef.current?.click();
  };

  // Zod setup for static form
  const {
    register,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const navigate = useNavigate();

  // States
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isAcademicExperienceOpen, setIsAcademicExperienceOpen] =
    useState(false);
  const [isProfessionalExperienceOpen, setIsProfessionalExperienceOpen] =
    useState(false);
  const [isAccountDeletionModalVisible, setIsAccountDeletionModalVisible] =
    useState(false);
  const { clearToken } = useAuthStore((state) => state);

  //callback (kept for legacy compatibility but not used)
  const {
    isLoading: submitLoading,
  } = useApi(ProfileServices.putFormOne);

  // State for storing content creator data
  const [contentCreatorData, setContentCreatorData] = useState<ContentCreator | null>(null);

  // Helper function to build content creator update payload
  // Returns a consistent payload structure with all required fields
  const buildUpdatePayload = (overrides: Partial<Omit<ContentCreator, 'profilePicture'>> & { profilePicture?: string | number } = {}) => {
    // Determine valid statusValue - default to PENDING if current value is invalid
    const validStatusValues: Array<"PENDING" | "APPROVED" | "REJECTED"> = ["PENDING", "APPROVED", "REJECTED"];
    const currentStatusValue = overrides.statusValue ?? contentCreatorData?.statusValue;
    const statusValue = (currentStatusValue && validStatusValues.includes(currentStatusValue)) 
      ? currentStatusValue 
      : "PENDING";

    const payload: any = {
      firstName: overrides.firstName ?? contentCreatorData?.firstName ?? "",
      lastName: overrides.lastName ?? contentCreatorData?.lastName ?? "",
      biography: overrides.biography ?? contentCreatorData?.biography ?? "",
      email: overrides.email ?? contentCreatorData?.email ?? "",
      education: overrides.education ?? contentCreatorData?.education ?? "",
      statusValue: statusValue,
      courseExperience: overrides.courseExperience ?? contentCreatorData?.courseExperience ?? "",
      institution: overrides.institution ?? contentCreatorData?.institution ?? "",
      eduStart: overrides.eduStart ?? contentCreatorData?.eduStart ?? new Date().toISOString().split('T')[0],
      eduEnd: overrides.eduEnd ?? contentCreatorData?.eduEnd ?? new Date().toISOString().split('T')[0],
      currentCompany: overrides.currentCompany ?? contentCreatorData?.currentCompany ?? "",
      currentJobTitle: overrides.currentJobTitle ?? contentCreatorData?.currentJobTitle ?? "",
      companyStart: overrides.companyStart ?? contentCreatorData?.companyStart ?? new Date().toISOString().split('T')[0],
    };
    
    if (overrides.profilePicture !== undefined) {
      payload.profilePicture = overrides.profilePicture;
    }
    
    return payload;
  };

  // Form submit, sends data to backend upon user interaction
  const handleUpdateSubmit = async () => {
    try {
      const documentId = localStorage.getItem("id");
      if (!documentId) {
        toast.error("Erro: ID do usuário não encontrado");
        return;
      }

      console.log("Form data before submit:", formData);

      // Split the name into firstName and lastName
      const nameParts = formData.userName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ");

      console.log("Name parts:", { firstName, lastName });

      const payload = buildUpdatePayload({
        firstName: firstName,
        lastName: lastName || "",
        biography: formData.bio || "",
        email: contentCreatorData?.email || formData.UserEmail,
      });

      console.log("Update payload:", payload);

      // Update content creator profile in Strapi
      const response = await contentCreatorPutContentCreatorsById({
        path: { id: documentId },
        body: {
<<<<<<< HEAD:web/src/features/user/components/profile.tsx
          data: buildUpdatePayload({
            firstName: firstName,
            lastName: lastName || "",
            biography: formData.bio || "",
<<<<<<< HEAD:web/src/features/user/components/profile.tsx
            // Note: Keep existing required fields from the current data
            email: contentCreatorData?.email ?? formData.userEmail,
            password: "", // Send empty string - controller will remove it before processing
            education: (contentCreatorData?.education ?? "TODO1"),
            statusValue: (contentCreatorData?.statusValue ?? "TODO1"),
            courseExperience: contentCreatorData?.courseExperience ?? "",
            institution: contentCreatorData?.institution ?? "",
            eduStart: contentCreatorData?.eduStart ?? new Date().toISOString().split('T')[0],
            eduEnd: contentCreatorData?.eduEnd ?? new Date().toISOString().split('T')[0],
            currentCompany: contentCreatorData?.currentCompany ?? "",
            currentJobTitle: contentCreatorData?.currentJobTitle ?? "",
            companyStart: contentCreatorData?.companyStart ?? new Date().toISOString().split('T')[0],
          },
=======
            email: contentCreatorData?.email || formData.UserEmail,
          }),
>>>>>>> 4d33468f (feat: update profile picture handling and improve payload structure for content creator):web/src/features/user/components/Profile.tsx
=======
          data: payload,
>>>>>>> c2a90af4 (Refactor course columns, enhance file upload hook, and improve profile component):web/src/features/user/components/Profile.tsx
        },
      });

      console.log("Update response:", response);

      if (response) {
        // Update local storage with new name
        try {
          const userInfo = JSON.parse(localStorage.getItem("loggedInUser") ?? "{}");
          userInfo.firstName = firstName;
          userInfo.lastName = lastName;
          localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
        } catch (storageError) {
          console.error("Failed to update localStorage:", storageError);
          // Don't fail the whole operation if localStorage fails
        }

        // Show success message
        toast.success("Perfil atualizado com sucesso!");
        
        // Invalidate and refetch the content creator query to get fresh data
        queryClient.invalidateQueries({ queryKey: ['contentCreator', documentId] });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type using mimetype
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, GIF ou WebP)');
        return;
      }

      // file size sat til (max 5MB) - could be changed 
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      const documentId = localStorage.getItem("id");
      if (!documentId) {
        toast.error("Erro: ID do usuário não encontrado");
        return;
      }

      // Upload the file with upload hook
      const uploadResult = await uploadFile([{
        file,
        filename: file.name,
        alt: "Profile Picture",
        caption: "Profile Picture"
      }]);

      console.log("Upload result:", uploadResult);

      if (!uploadResult || uploadResult.length === 0) {
        toast.error("Erro ao fazer upload da imagem");
        return;
      }

<<<<<<< HEAD:web/src/features/user/components/profile.tsx
      // Extract the file ID from the uploaded file object
      const uploadedFile = Array.isArray(uploadedFileIds) ? uploadedFileIds[0] : uploadedFileIds;
      const fileId = uploadedFile?.id || uploadedFile?.documentId;

      if (!fileId) {
        toast.error("Erro: ID do arquivo não encontrado");
        return;
      }
=======
      const fileId = uploadResult[0].id;
      console.log("File ID extracted:", fileId);
>>>>>>> c2a90af4 (Refactor course columns, enhance file upload hook, and improve profile component):web/src/features/user/components/Profile.tsx

      // Delete existing profile picture if it is there 
      if (contentCreatorData?.profilePicture?.id) {
        await handleProfilePictureDelete(false); 
      }

      // Update content creator with new profile picture
      const updatePayload = buildUpdatePayload({ profilePicture: fileId });
      console.log("Profile picture update payload:", updatePayload);
      
      const updateResponse = await contentCreatorPutContentCreatorsById({
        path: { id: documentId },
        body: {
<<<<<<< HEAD:web/src/features/user/components/profile.tsx
          data: {
            firstName: contentCreatorData?.firstName || "",
            lastName: contentCreatorData?.lastName || "",
            biography: contentCreatorData?.biography,
            email: contentCreatorData?.email || "noemail@example.com",
            education: contentCreatorData?.education || "TODO1",
            statusValue: contentCreatorData?.statusValue || "PENDING",
            courseExperience: contentCreatorData?.courseExperience || "",
            institution: contentCreatorData?.institution || "",
            eduStart: contentCreatorData?.eduStart || new Date().toISOString().split('T')[0],
            eduEnd: contentCreatorData?.eduEnd || new Date().toISOString().split('T')[0],
            currentCompany: contentCreatorData?.currentCompany || "",
            currentJobTitle: contentCreatorData?.currentJobTitle || "",
            companyStart: contentCreatorData?.companyStart || new Date().toISOString().split('T')[0],
            profilePicture: fileId,
          },
          data: buildUpdatePayload({ profilePicture: fileId }),
=======
          data: updatePayload,
>>>>>>> c2a90af4 (Refactor course columns, enhance file upload hook, and improve profile component):web/src/features/user/components/Profile.tsx
        },
      });

      console.log("Profile picture update response:", updateResponse);

      toast.success("Foto de perfil atualizada com sucesso!");
      
      // Invalidate and refetch the content creator query
      queryClient.invalidateQueries({ queryKey: ['contentCreator', documentId] });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      if (error instanceof Error) {
        toast.error(`Erro ao fazer upload da foto de perfil: ${error.message}`);
      } else {
        toast.error("Erro ao fazer upload da foto de perfil");
      }
    }
  };

  // profile picture delete
  const handleProfilePictureDelete = async (showToast = true) => {
    try {
      const documentId = localStorage.getItem("id");
      if (!documentId) {
        toast.error("Erro: ID do usuário não encontrado");
        return;
      }

      const profilePictureId = contentCreatorData?.profilePicture?.id;
      if (!profilePictureId) {
        if (showToast) {
          toast.info("Nenhuma foto de perfil para deletar");
        }
        return;
      }

      // Delete the file from upload plugin
      const baseUrl = getBaseApiUrl();
      const deleteResponse = await fetch(`${baseUrl}/upload/files/${profilePictureId}`, {
        method: "DELETE",
        headers: fetchHeaders(),
      });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete profile picture file");
      }

      // Update content creator to remove profile picture reference
      await contentCreatorPutContentCreatorsById({
        path: { id: documentId },
        body: {
<<<<<<< HEAD:web/src/features/user/components/profile.tsx
          data: {
            firstName: contentCreatorData?.firstName || "",
            lastName: contentCreatorData?.lastName || "",
            biography: contentCreatorData?.biography || "",
            email: contentCreatorData?.email || "",
            password: "",
            education: (contentCreatorData?.education || "TODO1") as "TODO1" | "TODO2" | "TODO3",
            statusValue: contentCreatorData?.statusValue || "PENDING",
            courseExperience: contentCreatorData?.courseExperience || "",
            institution: contentCreatorData?.institution || "",
            eduStart: contentCreatorData?.eduStart || new Date().toISOString().split('T')[0],
            eduEnd: contentCreatorData?.eduEnd || new Date().toISOString().split('T')[0],
            currentCompany: contentCreatorData?.currentCompany || "",
            currentJobTitle: contentCreatorData?.currentJobTitle || "",
            companyStart: contentCreatorData?.companyStart || new Date().toISOString().split('T')[0],
          },
=======
          data: buildUpdatePayload(),
>>>>>>> 4d33468f (feat: update profile picture handling and improve payload structure for content creator):web/src/features/user/components/Profile.tsx
        },
      });

      if (showToast) {
        toast.success("Foto de perfil deletada com sucesso!");
      }
      
      // Invalidate and refetch the content creator query
      queryClient.invalidateQueries({ queryKey: ['contentCreator', documentId] });
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      if (showToast) {
        toast.error("Erro ao deletar foto de perfil");
      }
    }
  };

  // Effects

  // Get query client for cache invalidation
  const queryClient = useQueryClient();
  const documentId = localStorage.getItem("id");

  // Render and fetch userData
  const { data: fetchedCreatorData, error: creatorError } = useQuery({
    queryKey: ['contentCreator', documentId],
    queryFn: async () => {
      if (!documentId) {
        throw new Error("No documentId found in localStorage");
      }
      const response = await contentCreatorGetContentCreatorsById({
        path: { id: documentId },
        query: {
          populate: '*',
        },
      });
      return response?.data ?? null;
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Update local state when query data changes
  useEffect(() => {
    if (fetchedCreatorData) {
      setContentCreatorData(fetchedCreatorData as ContentCreator);
      setFormData((prevData) => ({
        ...prevData,
        userName: `${fetchedCreatorData.firstName || ""} ${fetchedCreatorData.lastName || ""}`.trim(),
        userEmail: fetchedCreatorData.email || "",
        bio: fetchedCreatorData.biography ?? "",
        linkedin: "",
      }));
    }
  }, [fetchedCreatorData, setFormData]);

  // Handle query errors
  useEffect(() => {
    if (creatorError) {
      console.error("Error fetching content creator data:", creatorError);
      toast.error("Erro ao carregar dados do perfil");
    }
  }, [creatorError]);

  // Render and fetch userData
     
  useEffect(() => {
      if (!userID) return;
      const load = async () => {
          await fetchDynamicData();
    };
      void load();
  }, [userID]);

  // Delete account confirmation modal
  const openAccountDeletionModal = () => {
    setIsAccountDeletionModalVisible(true);
  };
  const closeAccountDeletionModal = () => {
    setIsAccountDeletionModalVisible(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const statusCode = await AccountServices.deleteAccount();
      if (statusCode !== 200) throw new Error();

      closeAccountDeletionModal();

      // Clear local storage
      localStorage.removeItem("id");
      localStorage.removeItem("userInfo");
      clearToken();
      localStorage.removeItem("token");

      navigate("/welcome");

      // Toastify notification: 'Account deleted successfully!'
      toast.success("Conta excluída com sucesso!", {
        pauseOnHover: false,
        draggable: false,
      });
    } catch (error) {
        console.error("Error deleting account:", error);
      closeAccountDeletionModal();

      // Toastify notification: 'Failed to delete account!'
      toast.error("Erro ao excluir conta!", {
        pauseOnHover: false,
        draggable: false,
      });
      return;
    }
  };

  return (
    <Layout meta="Profile">
      <main className="grow overflow-x-hidden bg-secondary h-screen font-['Montserrat']">
        {/* Dynamic forms */}
        <form className="text-center py-8 px-10 w-full">
          <div className="inline-block ">
            {/* Page title */}
            <div className="text-left mt-16 mb-20 text-neutral-700 text-[32px] font-bold">
              Editar perfil
            </div>

            {/* Personal information */}
            <div className="personal-information-form">
              <button
                type="button"
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isPersonalInfoOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
                    : "rounded-lg bg-white text-neutral-700 text-grayDark"
                }`}
                onClick={() => {
                  setIsPersonalInfoOpen(!isPersonalInfoOpen);
                }}
              >
                <div className="flex items-start">
                  {isPersonalInfoOpen ? (
                    <Icon path={mdiChevronUp} size={1} className="text-white" />
                  ) : (
                    <Icon
                      path={mdiChevronDown}
                      size={1}
                      className="text-grayDark"
                    />
                  )}
                  Informações pessoais
                </div>
              </button>
            </div>

            <PersonalInformationForm
              formData={formData}
              errors={errors}
              handleCharCountBio={handleCharCountBio}
              toggleMenu1={isPersonalInfoOpen}
              imageClick={imageClick}
              handleFileChange={handleProfilePictureUpload}
              handleProfilePictureDelete={handleProfilePictureDelete}
              myRef={myRef}
              register={register}
              handleInputChange={handleInputChange}
              profilePictureUrl={contentCreatorData?.profilePicture?.url}
            />

            {/* Academic experience form */}

            {/* Form button */}
            <div className="academic-experience-form">
              <button
                type="button"
                // Open/closed form styling
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isAcademicExperienceOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-primary text-white" // When open: rounded top corners, primary background, white text
                    : "rounded-lg bg-white text-neutral-700 text-grayDark" // When closed: rounded corners, white background, gray text
                }`}
                onClick={() => {
                  setIsAcademicExperienceOpen(!isAcademicExperienceOpen);
                }}
              >
                <div className="flex items-start">
                  {/* Render chevron up/down icon white/gray  */}
                  {isAcademicExperienceOpen ? (
                    <Icon path={mdiChevronUp} size={1} className="text-white" />
                  ) : (
                    <Icon
                      path={mdiChevronDown}
                      size={1}
                      className="text-grayDark"
                    />
                  )}
                  Experiências acadêmicas
                </div>
              </button>
            </div>

            {/* Render empty form if database is empty */}
            {isAcademicExperienceOpen &&
              (educationFormData.length === 0 ? (
                <AcademicExperienceForm
                  key={0}
                  index={0}
                  educationFormData={emptyAcademicObject}
                  handleEducationInputChange={handleEducationInputChange}
                  educationErrors={educationErrors}
                  addNewEducationForm={addNewEducationForm}
                  handleEducationDelete={handleEducationDelete}
                  errors={errors}
                />
              ) : (
                educationFormData.map((_form, index) => (
                  <AcademicExperienceForm
                    key={index}
                    index={index}
                    educationFormData={educationFormData}
                    handleEducationInputChange={handleEducationInputChange}
                    educationErrors={educationErrors}
                    addNewEducationForm={addNewEducationForm}
                    handleEducationDelete={handleEducationDelete}
                    errors={errors}
                  />
                ))
              ))}

            {/* Spacing between forms */}
            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-3" />
            </div>

            {/* Professional experience */}
            <div className="professional-experience-form">
              <button
                type="button"
                // Open/closed form styling
                className={`third_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isProfessionalExperienceOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-primary text-white" // When open: rounded top corners, primary background, white text
                    : "rounded-lg bg-white text-neutral-700 text-grayDark" // When closed: rounded corners, white background, gray text
                }`}
                onClick={() => {
                  setIsProfessionalExperienceOpen(
                    !isProfessionalExperienceOpen
                  );
                }}
              >
                <div className="flex items-start">
                  {isProfessionalExperienceOpen ? (
                    <Icon path={mdiChevronUp} size={1} className="text-white" />
                  ) : (
                    <Icon
                      path={mdiChevronDown}
                      size={1}
                      className="text-grayDark"
                    />
                  )}
                  Experiências profisisonais
                </div>
              </button>
            </div>

            {/* Render empty form if database is empty */}
            {isProfessionalExperienceOpen &&
              (experienceFormData.length === 0 ? (
                <ProfessionalExperienceForm
                  key={0}
                  index={0}
                  experienceFormData={emptyProfessionalObject}
                  handleExperienceInputChange={handleExperienceInputChange}
                  experienceErrors={experienceErrors}
                  addNewExperienceForm={addNewExperienceForm}
                  handleExperienceDelete={handleExperienceDelete}
                  handleCountExperience={handleCountExperience}
                  handleCheckboxChange={handleCheckboxChange}
                  errors={errors}
                />
              ) : (
                experienceFormData.map((_form, index) => (
                  <ProfessionalExperienceForm
                    key={index}
                    index={index}
                    experienceFormData={experienceFormData}
                    handleExperienceInputChange={handleExperienceInputChange}
                    experienceErrors={experienceErrors}
                    addNewExperienceForm={addNewExperienceForm}
                    handleExperienceDelete={handleExperienceDelete}
                    handleCountExperience={handleCountExperience}
                    handleCheckboxChange={handleCheckboxChange}
                    errors={errors}
                  />
                ))
              ))}

            {/* Bottom page buttons */}
            <div className="w-[1000px] h-[52px] justify-between items-center inline-flex gap-4 mt-16">
              {/* Account deletion */}
              <button
                type="button"
                onClick={() => {
                  openAccountDeletionModal();
                }}
                className="text-center text-red-500 text-lg font-bold underline"
              >
                Deletar conta
              </button>

              {/* Cancel edits */}
              <Link
                to="/courses"
                className="text-cyan-800 font-bold text-lg underline grow text-right ml-auto"
              >
                Cancelar edições
              </Link>

              {/* Save changes */}
              <button
                type="button"
                onClick={() => {
                    handleUpdateSubmit();
                }}
                className="px-10 py-4 rounded-lg justify-center items-center gap-2.5 flex text-center text-lg font-bold bg-primary hover:bg-cyan-900 text-white"
                disabled={submitLoading}
              >
                {" "}
                {submitLoading ? (
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2" />
                ) : null}
                Salvar ediçõe
              </button>
            </div>
          </div>
        </form>

        {/* Delete account confirmation modal */}
        <GenericModalComponent
          title="Deletar conta"
          contentText="Você tem certeza que deseja deletar a sua conta? Todos os seus dados serão removidos permanentemente. Essa ação não pode ser desfeita."
          cancelBtnText="Cancelar"
          confirmBtnText="Confirmar"
          onConfirm={handleDeleteAccount}
          onClose={closeAccountDeletionModal}
          isVisible={isAccountDeletionModalVisible}
        />
      </main>
    </Layout>
  );
};

export default Profile;