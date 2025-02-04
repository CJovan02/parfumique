import { isAxiosError, isCancel } from "axios";
import { client } from "../axios";
import {
  GetUserResponse,
  LoginResponse,
  UpdateSelfDto,
  User,
  UserLogin,
} from "../../dto-s/UserDto";
import {
  ConflictError,
  NotFoundError,
  UsernameExists,
  WrongCredentials,
} from "../../dto-s/Errors";
import { FragranceInfinitePagination } from "../../dto-s/FragranceDto";
import useAxiosAuth from "../../hooks/useAxiosPrivate";

export default function useUserController() {
  const LIMIT = 8;
  const axiosAuth = useAxiosAuth();
  const userController = {
    register: async function (user: User): Promise<void> {
      try {
        await client.post("/User/register", user);
      } catch (error) {
        console.log(error);
        if (isAxiosError(error) && error.name === "CanceledError") {
          throw Error("Request was canceled!");
        } else if (isAxiosError(error) && error.response != null) {
          switch (error.response.status) {
            case 409:
              throw new UsernameExists();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    },
    login: async function (user: UserLogin): Promise<LoginResponse> {
      try {
        const response = await client.post(
          `User/login`,
          JSON.stringify({
            Username: user.username,
            Password: user.password,
          }),
          { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
      } catch (error) {
        if (isCancel(error)) {
          throw Error("Request was canceled");
        } else if (isAxiosError(error) && error.response != null) {
          switch (error.response.status) {
            case 401:
              throw new WrongCredentials();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    },
    get: async function (): Promise<GetUserResponse> {
      try {
        const response = await axiosAuth.get("/User/get-self");
        return response.data;
      } catch (error) {
        if (isAxiosError(error) && error.name === "CanceledError") {
          throw error;
        } else if (isAxiosError(error) && error.response?.status != null) {
          switch (error.response.status) {
            case 404:
              throw new NotFoundError();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    },
    getFragrances: async function ({
      username,
      pageParam,
    }: {
      username: string;
      pageParam: number;
    }): Promise<FragranceInfinitePagination> {
      try {
        const response = await axiosAuth.get(
          `/User/fragrances/${username}/${pageParam}`
        );
        response.data.nextPage =
          LIMIT == response.data.fragrances.length ? pageParam + 1 : null;
        return response.data;
      } catch (error) {
        if (isAxiosError(error) && error.name === "CanceledError") {
          throw error;
        } else if (isAxiosError(error) && error.response?.status != null) {
          switch (error.response.status) {
            case 404:
              throw new NotFoundError();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    },
    addFragrance: async function (id: number): Promise<void> {
      try {
        await axiosAuth.patch(
          `https://localhost:8080/User/add-fragrance-to-self`,
          { FragranceId: id }
        );
      } catch (error) {
        if (isAxiosError(error) && error.name === "CanceledError") {
          throw Error("Request was canceled!");
        } else if (isAxiosError(error) && error.response?.status != null) {
          switch (error.response.status) {
            case 404:
              throw new NotFoundError();
            case 409:
              throw new ConflictError();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    },
    deleteFragrance: async function (id: number): Promise<void> {
      try {
        await axiosAuth.patch(
          `https://localhost:8080/User/delete-fragrance-from-self`,
          { FragranceId: id }
        );
      } catch (error) {
        if (isAxiosError(error) && error.name === "CanceledError") {
          throw Error("Request was canceled!");
        } else if (isAxiosError(error) && error.response?.status != null) {
          switch (error.response.status) {
            case 404:
              throw new NotFoundError();
            case 409:
              throw new ConflictError();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    },

    updateSelf: async function(updateSelfDto: UpdateSelfDto): Promise<true> {
      try {
        await axiosAuth.patch(
          "/user/update-self",
          JSON.stringify(updateSelfDto),
          { headers: {'Content-Type': 'application/json'} }
        );

        return true;
      } catch (error) {
        if (isAxiosError(error) && error.name === "CanceledError") {
          throw Error("Request was canceled!");
        } else if (isAxiosError(error) && error.response?.status != null) {
          switch (error.response.status) {
            case 404:
              throw new NotFoundError();
            case 409:
              throw new ConflictError();
            default:
              throw Error("Axios Error: " + error.message);
          }
        } else if (error instanceof Error) {
          throw Error("General Error: " + error.message);
        } else {
          throw Error("Unexpected Error: " + error);
        }
      }
    }
  };
  
  return userController;
}
