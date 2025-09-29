/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react';
import AdminServices from '../services/admin.services';
import UserDetailsModal from '../components/Admin/UserInfo/DetailsModalUser';
import { getUserToken } from '../helpers/userInfo';
import AuthServices from '../services/auth.services';
import { useApi } from '../hooks/useAPI';
import { toast } from 'react-toastify';

interface ViewUserButtonProps {
  applicationId: string;
  onHandleStatus: () => void;
}

const ViewUserButton: React.FC<ViewUserButtonProps> = ({ applicationId, onHandleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null); // Replace with the appropriate type
  const [userApplication, setUserApplication] = useState<any>(null); // Replace with the appropriate type
  const [contentCreator, setContentCreator] = useState<any>(null); // Replace with the appropriate type

  const { call: fetchUserDetails, isLoading, error } = useApi(async (applicationId: string, token: string) => {
    const userDetails = await AdminServices.getSingleUserDetails(applicationId, token);
    const userApplication = await AuthServices.GetSingleCCApplication(applicationId);
    const contentCreator = await AdminServices.getContentCreator(applicationId, token);
    return { userDetails, userApplication: userApplication.data, contentCreator };
  });

  const handleClick = async () => {
    try {
      const token = getUserToken();
      if (!token) {
        console.error('No token found');
        return;
      }
      const { userDetails, userApplication, contentCreator } = await fetchUserDetails(applicationId, token);
      setUserDetails(userDetails);
      setUserApplication(userApplication);
      setContentCreator(contentCreator);
      setIsModalOpen(true);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const refreshUserDetails = async () => {
    try {
      const token = getUserToken();
      if (!token) {
        console.error('No token found');
        return;
      }
      const { userDetails, userApplication, contentCreator } = await fetchUserDetails(applicationId, token);
      setUserDetails(userDetails);
      setUserApplication(userApplication);
      setContentCreator(contentCreator);
    } catch (error) {
      console.error("Failed to refresh user details:", error);
    }
  };

  return (
    <>
      <button 
        onClick={handleClick} 
        id="viewDetails" 
        className="flex items-center justify-center p-4 bg-[#166276] rounded-full font-semibold text-base text-white hover:bg-[#164E63]"
      >
        <svg className="shrink-0 size-3.5" width="15" height="15" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
        </svg>
      </button>
      <UserDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userDetails={userDetails} 
        userApplication={userApplication} 
        contentCreator={contentCreator} 
        token={getUserToken()} 
        applicationId={applicationId} 
        onHandleStatus={() => {
          onHandleStatus();
          refreshUserDetails();
        }} 
        loading={isLoading} 
      />
    </>
  );
};

export default ViewUserButton;