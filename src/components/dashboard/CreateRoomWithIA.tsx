"use client";

import { useState } from "react";
import { SlPencil } from "react-icons/sl";
import { LuBrainCircuit } from "react-icons/lu";
import { createRoom } from "~/app/actions/rooms";
import {generateProjectFromPrompt} from "~/app/api/ia-services/iaServices"
import GenerateWithIaModal from "./GenerateWithIaModal";


export default function CreateRoomWithIa() {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(true)}
        className="flex h-fit w-fit cursor-pointer select-none items-center gap-3 rounded-xl bg-gray-100 px-6 py-5 transition-all hover:bg-blue-500"
      >
        <div className="flex h-fit w-fit items-center justify-center rounded-full bg-blue-600 p-2">
          <LuBrainCircuit className="h-4=6 w-4 text-white" />
        </div>
        <div className="flex flex-col gap-0.5 text-[11px]">
          <p className={`font-semibold ${hover ? "text-white" : "text-black"}`}>
            Generar con IA
          </p>
          <p className={`${hover ? "text-white" : "text-black"}`}>
            Generar nuevo diseño con IA
          </p>
        </div>
      </div>
      {open && <GenerateWithIaModal onClose={() => setOpen(false)} />}
    </>
  );
}