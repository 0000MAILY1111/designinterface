"use client";

import {
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { ReactNode, useEffect, useState } from "react";
import {
  getProjectById,
  deleteProjectById,
} from "~/app/api/ia-services/iaServices";
import { Layer } from "~/types";

type RoomProps = {
  children: ReactNode;
  roomId: string;
};

export function parseLiveblocksData(obj: any): any {
  if (!obj || typeof obj !== "object" || !obj.liveblocksType) return obj;

  switch (obj.liveblocksType) {
    case "LiveObject": {
      // Devuelve un objeto plano con claves y valores procesados
      return Object.fromEntries(
        Object.entries(obj.data).map(([key, val]) => [key, parseLiveblocksData(val)])
      );
    }

    case "LiveMap": {
      return new LiveMap(
        Object.entries(obj.data).map(([key, val]) => [key, parseLiveblocksData(val)])
      );
    }

    case "LiveList": {
      return new LiveList(obj.data.map((item: any) => parseLiveblocksData(item)));
    }

    default:
      return obj;
  }
}

export function Room({ children, roomId }: RoomProps) {
  const [initialStorage, setInitialStorage] = useState<null | any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const cleanRoomId = roomId.startsWith("room:") ? roomId.slice(5) : roomId;
    async function fetchAndDeleteProject() {
      try {
        const response = await getProjectById(cleanRoomId);
        console.log(response)
        const data = {
          roomColor : response.data.roomColor,
          layerIds : response.data.layerIds,  
          layers : response.data.layers 
        }
        console.log(data)
        if (isMounted) {
          const parsed = parseLiveblocksData(response);
          //  setInitialStorage(parsed || null);
          setInitialStorage(parsed);
          
          // ✅ Eliminar el archivo del backend después de cargar
          await deleteProjectById(cleanRoomId);
        }
      } catch (error) {
        console.warn("No se encontró el proyecto, usando almacenamiento por defecto");
      } finally {
        if (isMounted) setReady(true);
      }
    }

    fetchAndDeleteProject();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  const defaultStorage = {
    roomColor: { r: 30, g: 30, b: 30 },
    layers: new LiveMap<string, LiveObject<Layer>>(),
    layerIds: new LiveList([]),
  };
  console.log(initialStorage)

  if (!ready) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <img
          src="/figma-logo.svg"
          alt="Figma logo"
          className="h-[50px] w-[50px] animate-bounce"
        />
        <h1 className="text-sm font-normal">Cargando proyecto...</h1>
      </div>
    );
  }

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          selection: [],
          cursor: null,
          penColor: null,
          pencilDraft: null,
        }}
        initialStorage={initialStorage ?? defaultStorage}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex h-screen flex-col items-center justify-center gap-2">
              <img
                src="/figma-logo.svg"
                alt="Figma logo"
                className="h-[50px] w-[50px] animate-bounce"
              />
              <h1 className="text-sm font-normal">Loading canvas</h1>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

