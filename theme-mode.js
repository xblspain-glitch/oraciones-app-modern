// Oraciones V3 LAB - Paso 20
// Módulo de modo claro/oscuro.
// Mantiene las funciones globales applyTheme() y toggleTheme() para no cambiar el comportamiento.

function applyTheme(){
  if(localStorage.getItem(THEME_KEY)==="dark"){
    document.body.classList.add("dark");
  }
}

function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, document.body.classList.contains("dark") ? "dark" : "light");
}
