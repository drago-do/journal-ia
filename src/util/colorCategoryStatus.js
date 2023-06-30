export function getCategoryColor(category) {
  switch (category) {
    case "Ingeniería Civil":
      return "bg-blue-200 text-blue-900 rounded p-1 font-semibold text-xs my-1";
    case "Ciencias en Alimentos":
      return "bg-green-500 text-white rounded p-1 font-semibold text-xs my-1";
    case "Administración":
      return "bg-red-200 text-red-900 rounded p-1 font-semibold text-xs my-1";
    case "Logística":
      return "bg-purple-200 text-purple-900 rounded p-1 font-semibold text-xs my-1";
    case "Turismo":
      return "bg-yellow-200 text-yellow-900 rounded p-1 font-semibold text-xs my-1";
    case "Industria 4.0":
      return "bg-teal-200 text-teal-900 rounded p-1 font-semibold text-xs my-1";
    case "Investigación Educativa":
      return "bg-pink-200 text-pink-900 rounded p-1 font-semibold text-xs my-1";
    case "Ciencias Básicas":
      return "bg-indigo-200 text-indigo-900 rounded p-1 font-semibold text-xs my-1";
    case "Sistemas Computacionales":
      return "bg-orange-200 text-orange-900 rounded p-1 font-semibold text-xs my-1";
    case "Mecatronica":
      return "bg-cyan-200 text-cyan-900 rounded p-1 font-semibold text-xs my-1";
    case "Electromecánica":
      return "bg-lime-200 text-lime-900 rounded p-1 font-semibold text-xs my-1";
    case "Gestión Empresarial":
      return "bg-gray-200 text-gray-900 rounded p-1 font-semibold text-xs my-1";
    default:
      return "";
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "wait_revisor":
      return "bg-yellow-500 text-black rounded p-1 font-semibold text-xs my-1";
    case "published":
      return "bg-green-500 text-withe rounded p-1 font-semibold text-xs my-1";
    case "reject":
      return "bg-red-500 text-white rounded p-1 font-semibold text-xs my-1";
    case "partial_reject":
      return "bg-orange-500 text-white rounded p-1 font-semibold text-xs my-1";
    // Agrega más casos según tus estados y colores deseados
    default:
      return "";
  }
}

export function getStatusText(status) {
  switch (status) {
    case "wait_revisor":
      return "En Revisión";
    case "published":
      return "Publicado";
    case "reject":
      return "Rechazado";
    case "partial_reject":
      return "2da Revisión";
    // Agrega más casos según tus estados y colores deseados
    default:
      return "";
  }
}
