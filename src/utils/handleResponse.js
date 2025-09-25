import { toast } from "react-hot-toast";

export const handleErrors = (error) => {
  if (typeof error == "string") {
    return toast.error(error, { duration: 5000 });
  }
  if (error?.message) {
    return toast.error(error?.message, { duration: 5000 });
  }
  if (error?.Message) {
    return toast.error(error?.Message, { duration: 5000 });
  }
  if (error?.title) {
    return toast.error(error?.title);
  } else if (error?.result?.error?.validationMessages?.length > 0) {
    return error?.result.error.validationMessages.forEach((message) => {
      toast.error(message, { duration: 5000 });
    });
  } else if (error?.result?.message) {
    return toast.error(error.result.message, { duration: 5000 });
  } else if (error?.message) {
    return toast.error(error?.message, { duration: 5000 });
  }
};

export const handleSuccess = (message) => {
  toast.success(message, { duration: 5000 });
};
