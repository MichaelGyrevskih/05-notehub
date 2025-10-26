import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createNote } from "../../services/noteService";
import type {CreateNoteDto } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./NoteForm.module.css";
import toast from "react-hot-toast";

interface NoteFormProps {
  onSuccess: () => void;
}


const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<"Todo" | "Work" | "Personal" | "Meeting" | "Shopping">()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

function NoteForm({ onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
    onError: () => toast.error("Failed to create note"),
  });

  return (
    <Formik<CreateNoteDto>
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <label>
            Title
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" className={styles.error} />
          </label>

          <label>
            Content
            <Field as="textarea" name="content" />
            <ErrorMessage name="content" component="div" className={styles.error} />
          </label>

          <label>
            Tag
            <Field as="select" name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={styles.error} />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Note"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default  NoteForm;