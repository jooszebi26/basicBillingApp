export default function LogoutButton() {
  const handleOnClick = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
            <button
          onClick={handleOnClick}
          style={{
            background: "#38a169",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Kilépés
        </button>
  )
}
