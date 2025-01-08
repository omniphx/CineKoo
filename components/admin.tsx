"use client";
import { useHaikus } from "@/components/hooks/useHaikus";
import { useCreateHaiku } from "@/components/hooks/useCreateHaikus";
import { useUpdateHaiku } from "@/components/hooks/useUpdateHaikus";
import { useDeleteHaiku } from "@/components/hooks/useDeleteHaikus";
import { useForm } from "react-hook-form";
import { Haiku } from "@prisma/client";
import { useState } from "react";

type HaikuFormData = Omit<Haiku, "id">;

export function Admin() {
  const { data: haikus, isLoading, error } = useHaikus();
  const createHaiku = useCreateHaiku();
  const updateHaiku = useUpdateHaiku();
  const deleteHaiku = useDeleteHaiku();
  const [editingHaiku, setEditingHaiku] = useState<Haiku | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<HaikuFormData>();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading haikus</div>;
  if (!haikus) return <div>No haikus found</div>;

  const onSubmit = async (data: HaikuFormData) => {
    if (editingHaiku) {
      await updateHaiku.mutateAsync({ ...data, id: editingHaiku.id });
      setEditingHaiku(null);
    } else {
      await createHaiku.mutateAsync(data);
    }
    reset();
  };

  const handleEdit = (haiku: Haiku) => {
    setEditingHaiku(haiku);
    setValue("title", haiku.title);
    setValue("prompt", haiku.prompt);
    setValue("body", haiku.body);
    setValue("date", new Date(haiku.date));
    setValue("movie_id", haiku.movie_id);
    setValue("difficulty", haiku.difficulty);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this haiku?")) {
      await deleteHaiku.mutateAsync(id);
    }
  };

  const handleCancel = () => {
    setEditingHaiku(null);
    reset();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingHaiku ? "Edit Haiku" : "Create New Haiku"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register("title", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <textarea
              {...register("prompt", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Body
            </label>
            <textarea
              {...register("body", { required: true })}
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
                      {new Date(haiku.date).toLocaleDateString()}
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
                      <button
                        onClick={() => handleEdit(haiku)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(haiku.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
