import Cookies from "js-cookie";
import { useRef, useState } from "react";

export default function AddUser({ handleClose, pdfInstance }) {
  const inputRef = useRef(null);
  const [isNameSaved, setNameSaved] = useState(false);
  function addNameToCookie() {
    const value = inputRef.current?.value;
    console.log("input name", value);
    Cookies.set("username", value);
    console.log("Add user submit button");
    setNameSaved(true);
    pdfInstance.setAnnotationCreatorName(value);
  }
  console.log("AddUser component is loaded");
  return (
    <div className="addUserBox" style={{ display: "block" }}>
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
            ref={inputRef}
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
              flexDirection: "row",
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
              onClick={() => addNameToCookie()}
            >
              Save the name
            </button>
            {isNameSaved ? <p>Your name now saved</p> : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
