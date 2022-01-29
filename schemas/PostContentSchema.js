import * as yup from "yup";

export const PostContentSchema = yup.object({
  content: yup
    .string()
    .required("There is no content")
    .min(10, "Content is too short")
    .max(200000, "Content is too long"),
});
