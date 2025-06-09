// GenerateWithIaModal.tsx
"use client";

import { useState } from "react";
import { generateProjectFromPrompt, generateProjectFromImage } from "~/app/api/ia-services/iaServices";
import { createRoomWithIa } from "~/app/actions/rooms";
import { useRouter } from "next/navigation";

export default function GenerateWithIaModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filename, setFilename] = useState("")
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (tab === "text") {
        const fn = await generateProjectFromPrompt(prompt); // llama al servicio
        setFilename(fn.filename)
      } else {
        const fn = await generateProjectFromImage(image!);
        setFilename(fn.filename)
      }
      setSuccess(true);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = async () => {
    try {
      const roomId = await createRoomWithIa(filename);
      if (roomId) router.push("/dashboard/" + roomId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[600px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-between border-b pb-2">
          <div className="flex gap-4">
            <button
              className={`pb-1 ${tab === "text" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
              onClick={() => setTab("text")}
            >
              Texto
            </button>
            <button
              className={`pb-1 ${tab === "image" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
              onClick={() => setTab("image")}
            >
              Imagen
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mt-4 min-h-[200px]">
          {tab === "text" && (
            <textarea
              className="w-full resize-none rounded border p-2"
              rows={6}
              placeholder="Describe lo que quieres generar..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          )}

          {tab === "image" && (
            <div className="flex flex-col items-center gap-4">
              {preview && (
                <img src={preview} alt="Preview" className="h-40 w-auto rounded" />
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {image && (
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  Eliminar imagen
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          {!success ? (
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={handleSubmit}
              disabled={loading || (tab === "text" && !prompt) || (tab === "image" && !image)}
            >
              {loading ? "Generando..." : "Enviar"}
            </button>
          ) : (
            <button
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              onClick={handleClick}
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
