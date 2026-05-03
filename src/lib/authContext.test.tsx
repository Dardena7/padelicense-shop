import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "./authContext";
import { tokenStore } from "./tokenStore";

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock("./tokenStore", () => ({
  tokenStore: {
    getAccessToken: vi.fn(() => null),
    setAccessToken: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, isLoading, login, signup, logout } = useAuth();

  if (isLoading) return <p>Loading</p>;

  if (user) {
    return (
      <div>
        <p>Logged in as {user.email}</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <p>Not logged in</p>
      <button onClick={() => login("john@example.com", "password123").catch(() => {})}>
        Login
      </button>
      <button
        onClick={() =>
          signup({
            email: "new@example.com",
            password: "password123",
            passwordConfirmation: "password123",
            firstName: "New",
            lastName: "User",
          })
        }
      >
        Signup
      </button>
    </div>
  );
};

const renderWithAuth = () => {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
};

const mockUserResponse = {
  user: {
    public_id: "uuid-123",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "customer",
  },
  access_token: "jwt-token-123",
};

describe("AuthContext", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.mocked(tokenStore.setAccessToken).mockClear();
    vi.mocked(tokenStore.getAccessToken).mockReturnValue(null);
  });

  describe("refresh on mount", () => {
    it("shows loading then not logged in after failed refresh", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      renderWithAuth();

      expect(screen.getByText("Loading")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });
    });

    it("restores session from refresh token", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      });

      renderWithAuth();

      await waitFor(() => {
        expect(
          screen.getByText("Logged in as john@example.com"),
        ).toBeInTheDocument();
      });

      expect(tokenStore.setAccessToken).toHaveBeenCalledWith("jwt-token-123");
    });

    it("sends credentials with refresh request", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      renderWithAuth();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/auth/refresh"),
          expect.objectContaining({
            method: "POST",
            credentials: "include",
          }),
        );
      });
    });
  });

  describe("login", () => {
    it("sets user after successful login", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false }); // refresh on mount

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      });

      fireEvent.click(screen.getByText("Login"));

      await waitFor(() => {
        expect(
          screen.getByText("Logged in as john@example.com"),
        ).toBeInTheDocument();
      });
    });

    it("sends credentials with login request", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false }); // refresh on mount

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      });

      fireEvent.click(screen.getByText("Login"));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/auth/login"),
          expect.objectContaining({
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              email: "john@example.com",
              password: "password123",
            }),
          }),
        );
      });
    });

    it("throws AuthError on failed login", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false }); // refresh on mount

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid email or password" }),
      });

      fireEvent.click(screen.getByText("Login"));

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });
    });
  });

  describe("signup", () => {
    it("sets user after successful signup", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false }); // refresh on mount

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });

      const signupResponse = {
        user: {
          public_id: "uuid-456",
          email: "new@example.com",
          first_name: "New",
          last_name: "User",
          role: "customer",
        },
        access_token: "jwt-token-456",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => signupResponse,
      });

      fireEvent.click(screen.getByText("Signup"));

      await waitFor(() => {
        expect(
          screen.getByText("Logged in as new@example.com"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("logout", () => {
    it("clears user after logout", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      }); // refresh on mount

      renderWithAuth();

      await waitFor(() => {
        expect(
          screen.getByText("Logged in as john@example.com"),
        ).toBeInTheDocument();
      });

      vi.mocked(tokenStore.getAccessToken).mockReturnValue("jwt-token-123");
      mockFetch.mockResolvedValueOnce({ ok: true }); // logout

      fireEvent.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
      });

      expect(tokenStore.setAccessToken).toHaveBeenCalledWith(null);
    });

    it("sends access token and credentials with logout request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      });

      renderWithAuth();

      await waitFor(() => {
        expect(
          screen.getByText("Logged in as john@example.com"),
        ).toBeInTheDocument();
      });

      vi.mocked(tokenStore.getAccessToken).mockReturnValue("jwt-token-123");
      mockFetch.mockResolvedValueOnce({ ok: true });

      fireEvent.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("/auth/logout"),
          expect.objectContaining({
            method: "DELETE",
            credentials: "include",
            headers: expect.objectContaining({
              Authorization: "Bearer jwt-token-123",
            }),
          }),
        );
      });
    });
  });
});
