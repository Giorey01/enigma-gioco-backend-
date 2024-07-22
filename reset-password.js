const { createClient } = supabase;
const supabaseUrl = "https://ihcblxdzwyvmpyqkwyew.supabase.co";
const supabaseKey =
  "placeholder";
const _supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener("beforeunload", beforeUnloadHandler);

  const resetForm = document.querySelector(".reset-form");
  const label = document.getElementById("label");
  const { data, error } = await _supabase.auth.getSession();
  console.log(data);
  if (data.session == null || error) {
    console.log("sbagliato");
    resetForm.innerHTML = `<h1>Sessione scaduta richiedi nuovamente email di reset</h1>`;
  }

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.querySelector("#new-password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (newPassword !== "" || confirmPassword !== "") {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    }

    if (newPassword !== confirmPassword) {
      alert("Le password non corrispondono.");
      window.addEventListener("beforeunload", beforeUnloadHandler);
    } else if (!strongPasswordRegex.test(newPassword)) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      alert(
        "La password deve contenere almeno una lettera maiuscola, una lettera minuscola e un numero."
      );
    } else {
      await _supabase.auth.updateUser({
        password: newPassword,
      });
      label.textContent = "Password successfully changed";
      await _supabase.auth.signOut();
      setTimeout(() => {
        window.location.href = "after_reset.html";
      }, 3000);
    }
  });
});

const beforeUnloadHandler = (event) => {
  event.preventDefault();
  event.returnValue = true;
};
