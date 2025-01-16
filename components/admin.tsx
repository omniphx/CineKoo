"use client";
import { useHaikus } from "@/components/hooks/haikus/useHaikus";
import { useForm } from "react-hook-form";
import { Haiku } from "@prisma/client";
import { useState } from "react";
import { Movie } from "@/lib/schemas";
import { MovieSearchInput } from "./ui/movie-search-input";
import { generatePrompt } from "@/lib/utils";
import { useCreateHaiku } from "./hooks/haikus/useCreateHaikus";
import { useUpdateHaiku } from "./hooks/haikus/useUpdateHaikus";
import { useDeleteHaiku } from "./hooks/haikus/useDeleteHaikus";

type HaikuFormData = Omit<Haiku, "id" | "date"> & {
  date: string;
};

export function Admin() {
  const { data: haikus, isLoading, error } = useHaikus();
  const createHaiku = useCreateHaiku();
  const updateHaiku = useUpdateHaiku();
  const deleteHaiku = useDeleteHaiku();
  const [editingHaiku, setEditingHaiku] = useState<Haiku>();
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [movieQuery, setMovieQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { register, handleSubmit, reset, setValue, getValues } =
    useForm<HaikuFormData>();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading haikus</div>;
  if (!haikus) return <div>No haikus found</div>;

  const generateHaiku = async (prompt: string) => {
    try {
      setErrorMessage("");
      const response = await fetch("/api/haikus/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate haiku");
      }

      const data = await response.json();
      setValue("body", data.choices[0].message.content);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const onSubmit = async (data: HaikuFormData) => {
    try {
      setErrorMessage(""); // Clear any previous errors

      console.log("data", data);
      console.log("date", data.date);
      console.log("type", typeof data.date);

      const normalizeDate = new Date(data.date);

      console.log("normalizeDate", normalizeDate, normalizeDate.toISOString());

      const formattedData = selectedMovie
        ? {
            ...data,
            movie_id: selectedMovie.id,
            date: new Date(data.date),
          }
        : {
            ...data,
            date: new Date(data.date),
          };

      if (editingHaiku) {
        await updateHaiku.mutateAsync({
          ...formattedData,
          id: editingHaiku.id,
        });
        setEditingHaiku(undefined);
      } else {
        await createHaiku.mutateAsync(formattedData);
      }
      reset();
      setSelectedMovie(undefined);
      setMovieQuery("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleEdit = (haiku: Haiku) => {
    setEditingHaiku(haiku);
    setValue("title", haiku.title);
    setValue("prompt", haiku.prompt);
    setValue("body", haiku.body);
    setValue("date", new Date(haiku.date).toISOString().split("T")[0]);
    setValue("movie_id", haiku.movie_id);
    setValue("difficulty", haiku.difficulty);
    setMovieQuery(haiku.title);
  };

  const handleDelete = async (id: number) => {
    try {
      setErrorMessage(""); // Clear any previous errors
      if (confirm("Are you sure you want to delete this haiku?")) {
        await deleteHaiku.mutateAsync(id);
      }
    } catch (error) {
      setErrorMessage(
        `Failed to delete haiku: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleCancel = () => {
    setEditingHaiku(undefined);
    setMovieQuery("");
    reset();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={() => setErrorMessage("")}>
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingHaiku ? "Edit Haiku" : "Create New Haiku"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Movie
            </label>
            <MovieSearchInput
              value={movieQuery}
              onChange={(value) => setMovieQuery(value)}
              onSelect={(movie) => {
                setSelectedMovie(movie);
                setValue("title", movie.title);
                setValue("movie_id", movie.id);
                setValue("prompt", generatePrompt(movie));
              }}
              placeholder="Search for a movie..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <textarea
              {...register("prompt", { required: true })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => generateHaiku(getValues("prompt"))}
              className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Generate Haiku
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Body
            </label>
            <textarea
              {...register("body", { required: true })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              {...register("date", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Movie ID
            </label>
            <input
              {...register("movie_id", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              {...register("difficulty", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="amateur">Amateur</option>
              <option value="journeyman">Journey Man</option>
              <option value="auteur">Auteur</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingHaiku ? "Update" : "Create"}
            </button>
            {editingHaiku && (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Haikus</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prompt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Body
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {haikus.map((haiku) => (
                  <tr key={haiku.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{haiku.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {haiku.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(haiku.date).toISOString()}
                    </td>
                    <td className="px-6 py-4">
                      <pre className="whitespace-pre-wrap">{haiku.prompt}</pre>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="whitespace-pre-wrap">{haiku.body}</pre>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {haiku.movie_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {haiku.difficulty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEdit(haiku)}
                          className="flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(haiku.id)}
                          className="flex items-center text-red-600 hover:text-red-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
