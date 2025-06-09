import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuFileCode2 } from "react-icons/lu";
import { useStorage } from "@liveblocks/react";

export default function GenerateCode({ roomId }: { roomId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const storage = useStorage((root) => root);

  const handleGenerate = () => {
    const json = storage;
    console.log("Generated JSON for project:", json);
    // Futuro: llamar al servicio de conversión a Flutter + descarga ZIP
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="h-fit w-fit rounded-md border-2 px-1 py-1"
      >
        <LuFileCode2 size={25} color="Black" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="flex w-full max-w-md flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <h2 className="text-[13px] font-semibold">Generate project</h2>
              <IoClose
                className="h-6 w-6 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="border-b border-gray-200" />
            <div className="space-y-3 p-4">
              <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-black focus:outline-none"
              />
              <button
                onClick={handleGenerate}
                className="w-full rounded-md bg-[#0c8ce9] px-4 py-2 text-sm text-white"
              >
                Generar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
