import { AxiosError } from "axios";
import { toast } from "sonner";

// ✅ Fix: Use `interface` without `=`
interface ApiErrorResponse {
  message: string;
}

export const handleRequest = async <T>(
  requestCallback: () => Promise<T>,
  setLoading?: (loading: boolean) => void
): Promise<T | null> => {
  if (setLoading) {
    setLoading(true);
  }

  try {
    const response = await requestCallback();
    return response;
  } catch (error) {
    // ✅ Fix: Rename variable to avoid shadowing import
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.log(error);

    if (axiosError.response?.data?.message) {
      console.log(axiosError.response.data.message);
      toast(axiosError.response.data.message);
    } else {
      toast.error("An unknown error occurred");
    }

    return null;
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
