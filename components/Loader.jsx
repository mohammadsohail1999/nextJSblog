export default function Loader({ show, progress }) {
  if (progress) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ marginBottom: "1rem" }}>{progress}%</p>
        <div className="loader"></div>
      </div>
    );
  }

  return show ? <div className="loader"></div> : null;
}
