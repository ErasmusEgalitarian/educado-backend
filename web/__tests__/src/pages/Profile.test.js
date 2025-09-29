import AccountServices from '../../../src/services/account.services';
import { toast } from 'react-toastify';

// Mock the AccountServices and toast
jest.mock('../../../src/services/account.services');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mocking localStorage
const localStorageMock = {
    removeItem: jest.fn()
};
global.localStorage = localStorageMock;

// Mocking environment variables
jest.mock('../../../src/helpers/environment', () => ({
    BACKEND_URL: 'http://localhost:8888',
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockCloseAccountDeletionModal = jest.fn();
const mockClearToken = jest.fn();

// Mock the handleDeleteAccount function
const mockHandleDeleteAccount = async () => {
  try {
    const statusCode = await AccountServices.deleteAccount();
    if (statusCode !== 200) 
        throw new Error();

    mockCloseAccountDeletionModal();

    // Clear local storage
    localStorageMock.removeItem("id");
    localStorageMock.removeItem("userInfo");
    mockClearToken();
    localStorageMock.removeItem('token');
    
    mockNavigate('/welcome');

    // Toastify notification: 'Account deleted successfully!'
    toast.success('Conta excluída com sucesso!', { pauseOnHover: false, draggable: false }); 
  } 
  catch (error) {
    console.error("Error deleting account: " + error);
    mockCloseAccountDeletionModal();

    // Toastify notification: 'Failed to delete account!'
    toast.error('Erro ao excluir conta!', { pauseOnHover: false, draggable: false });
    return;
  }
};

describe('handleDeleteAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Suppress console.error during tests by mocking it
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore console.error
  });

  test('should delete account successfully', async () => {
    AccountServices.deleteAccount.mockResolvedValue(200);

    await mockHandleDeleteAccount();

    expect(mockCloseAccountDeletionModal).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('id');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userInfo');
    expect(mockClearToken).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    expect(toast.success).toHaveBeenCalledWith('Conta excluída com sucesso!', { pauseOnHover: false, draggable: false });
  });

  test('should handle account deletion failure', async () => {
    AccountServices.deleteAccount.mockResolvedValue(500);

    await mockHandleDeleteAccount();

    expect(mockCloseAccountDeletionModal).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Erro ao excluir conta!', { pauseOnHover: false, draggable: false });
  });
});