import axios from "axios";
import AccountServices from "../../../src/services/account.services";
import { BACKEND_URL } from "../../../src/helpers/environment";

jest.mock("axios");

// Mocking localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

global.localStorage = localStorageMock;

// Mocking axios
jest.mock("axios");

jest.mock("../../../src/helpers/environment", () => ({
  BACKEND_URL: "http://localhost:8888",
}));

describe("AccountServices", () => {
  let mockToken, mockUser, originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = "653629e474db8481662bd04c";
    mockToken = "mockToken";

    // Suppress console.error during tests by mocking it
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore console.error
  });

  describe("deleteAccount", () => {
    it("should delete an account and return 200 status code on success", async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "id") return mockUser;

        if (key === "token") return mockToken;

        return null;
      });

      const responseStatus = 200;
      axios.delete.mockResolvedValue({ status: responseStatus });

      const result = await AccountServices.deleteAccount();

      expect(result).toEqual(responseStatus);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("id");
      expect(localStorageMock.getItem).toHaveBeenCalledWith("token");
      expect(axios.delete).toHaveBeenCalledWith(
        `${BACKEND_URL}/api/users/${mockUser}`,
        { headers: { Authorization: `Bearer ${mockToken}` } },
      );
    });

    it("should throw an error when account is not found in localStorage", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(AccountServices.deleteAccount()).rejects.toThrow(
        "No account found in localStorage!",
      );
    });

    it("should throw an error when token is not found in localStorage", async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "id") return mockUser;

        return null;
      });

      await expect(AccountServices.deleteAccount()).rejects.toThrow(
        "No token found in localStorage!",
      );
    });

    it("should throw an error when the delete request fails", async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "id") return mockUser;

        if (key === "token") return mockToken;

        return null;
      });

      const mockError = new Error();
      axios.delete.mockRejectedValue(mockError);

      await expect(AccountServices.deleteAccount()).rejects.toThrow(mockError);
    });
  });
});
