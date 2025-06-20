import { useCart } from "../../context/cartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CarritoPage = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePagar = async () => {
    if (!user) {
      alert("Debes iniciar sesión para pagar.");
      navigate("/login");
      return;
    }

    if (totalPrice === undefined || totalPrice === null) {
      alert("El total del carrito es inválido.");
      return;
    }

    try {
      const response = await fetch("/api/v1/webpay/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buy_order: "orden-" + Date.now(),
          session_id: user.id || "session-default",
          amount: parseFloat(totalPrice.toFixed(2)),
          return_url: window.location.origin + "/payment-result",
        }),
      });

      const data = await response.json();

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        alert("No se pudo iniciar el pago.");
      }
    } catch (error) {
      console.error("Error al procesar pago:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Tu Carrito</h2>

      {cart.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.nombre}`} // Mejora clave para evitar conflictos
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>{item.nombre}</strong>
              </p>
              <p>
                Precio: ${item.precio ? item.precio.toFixed(2) : "0.00"}
              </p>
              <p>Cantidad: {item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#d9534f",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Quitar
              </button>
            </div>
          ))}

          <h3>
            Total a pagar: $
            {totalPrice !== undefined && totalPrice !== null
              ? totalPrice.toFixed(2)
              : "0.00"}
          </h3>

          <button
            onClick={handlePagar}
            style={{
              background: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Pagar con Transbank
          </button>
        </>
      )}
    </div>
  );
};

export default CarritoPage;
