"use client";
const BASE_URL = "http://localhost:8000/api"; // Ajusta esta URL según tu entorno

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
