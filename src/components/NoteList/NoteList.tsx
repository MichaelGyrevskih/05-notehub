import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface NoteListProps {
  search: string;
  page: number;
  perPage: number;
}

 function NoteList({ search, page, perPage }: NoteListProps) {
  const queryClient = useQueryClient();
// Загружаем заметки
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { search, page, perPage }],
    queryFn: () => fetchNotes({ search, page, perPage }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load notes");
  }, [isError]);

  const mutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => toast.error("Failed to delete note"),
  });
// Удаление заметки
  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  if (isLoading) {
    toast.loading("Loading notes...");
    return null;
  }

  if (!data || data.results.length === 0) return null;

  return (
    <ul className={css.list}>
      {data.results.map((note: Note) => (
        <li key={note.id} className={css.item}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <span className={css.tag}>{note.tag}</span>
          <button onClick={() => handleDelete(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}


export default NoteList;