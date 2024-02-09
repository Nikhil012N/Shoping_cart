const MaintenanceMode = () => {
  return (
    <>
      {" "}
      <div style={{ height: "100vh", width: "100vw", position: "fixed" }}>
        <img
          src="/maintainencemode.jpg"
          alt="maintainence image"
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          position: "relative",
          fontSize: "3vmax",
          textAlign: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color:"white"
        }}
      >
        <p> Maintenance Mode Activated</p>
        <p> We will be back soon....</p>
      </div>
    </>
  );
};

export default MaintenanceMode;
