import Cookies from "js-cookie";

export default function AddUser({ displayBox, handleClose }) {
  console.log("AddUser component is loaded");
  return (
    <div
      className="addUserBox"
      style={{ display: displayBox ? "block" : "none" }}
    >
      <div className="parentAddUserBox">
        <div className="addUserForm">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              style={{ border: 0, background: "transparent" }}
              onClick={() => handleClose()}
            >
              X
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter you name"
            style={{
              width: "80%",
              height: "fit-content",
              padding: "10px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              width: "100%",
              height: "100%",
            }}
          >
            <button
              style={{
                width: "50%",
                height: "fit-content",
                margin: "10px 0 0 0 ",
                backgroundColor: "orange",
                padding: "10px",
              }}
            >
              Save the name
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
