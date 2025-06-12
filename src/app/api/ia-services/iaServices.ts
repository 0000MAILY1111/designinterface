
const BASE_URL = "https://flutter-generator-2psw1.onrender.com/api/analysis"; // Ajusta esta URL según tu entorno
const GENERATE_URL = "https://flutter-generator-2psw1.onrender.com/api/project"; // Ajusta esta URL según tu entorno
export async function generateProjectFromPrompt(prompt: string, token?: string) {
  const response = await fetch(`${BASE_URL}/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, token }),
  });

  if (!response.ok) {
    throw new Error("Error al generar proyecto");
  }

  return await response.json(); // { filename: string, status: "ok" }
}

export async function generateProjectFromImage(file: File, token?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (token) {
        formData.append("token", token);
    }

    const response = await fetch(`${BASE_URL}/image`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Error al generar proyecto desde imagen");
    }

    return await response.json(); // { filename: string, status: "ok" }
}

export async function renameProjectFile(oldFilename: string, newFilename: string) {
  const response = await fetch(`${BASE_URL}/project`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ old_filename: oldFilename, new_filename: newFilename }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al renombrar archivo");
  }

  return await response.json(); // { message: string }
}

export async function getProjectById(id: string) {
  const response = await fetch(`${BASE_URL}/project/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Proyecto no encontrado");
  }

  return await response.json(); // Devuelve el JSON del proyecto
}

export async function deleteProjectById(id: string) {
  const response = await fetch(`${BASE_URL}/project/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al eliminar proyecto");
  }

  return await response.json(); // { message: string }
}

export async function generateFlutterProject(
  projectName: string,
  projectData: any
): Promise<Blob> {
  console.log("Generating Flutter project with data:", projectData);
  const response = await fetch(`${GENERATE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name: projectName,
      project_data: projectData,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail?.detail || "Error al generar proyecto Angular");
  }

  return await response.blob(); // ZIP file
}
