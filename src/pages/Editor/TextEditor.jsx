import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import EditorHeader from "../../components/EditorHeader/EditorHeader";
import {
  useIsOpen,
  useToggleOffline,
  useToggleOpen,
  useUpdateTitle,
} from "../../store/UIContext";
import Modal from "../../components/Modal/Modal";
import EditDocDetail from "../EditDocDetail/EditDocDetail";
import {
  useAuthor,
  useEmail,
  useToken,
  useUpdateAuthor,
} from "../../store/AuthContext";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const navigate = useNavigate();
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [initialData, setInitialData] = useState();
  const [isReadOnly, setIsReadOnly] = useState(true);

  const email = useEmail();
  const setIsOffline = useToggleOffline();
  const token = useToken();
  const author = useAuthor();
  const setAuthor = useUpdateAuthor();
  const setTitle = useUpdateTitle();
  const isOpen = useIsOpen();
  const onClose = useToggleOpen();

  useEffect(() => {
    const fetchDocument = async () => {
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      try {
        const response = await fetch(
          `${BASE_URL}/documents/getone/${documentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.ok) {
          const documentData = await response.json();
          setInitialData(documentData.data);
          setTitle(documentData.title);
          setAuthor(documentData.author);
          localStorage.setItem("readAccess", documentData.readAccess);
          localStorage.setItem("writeAccess", documentData.writeAccess);
        } else {
          console.error("Failed to fetch document:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching document:", error.message);
      }
    };

    fetchDocument();
  }, [documentId, setTitle, token, setAuthor]);

  useEffect(() => {
    if (quill == null || initialData == null || author == null) return;

    quill.setContents(initialData.ops, "api");
    const writeAccess = localStorage.getItem("writeAccess")?.split(",");
    if (writeAccess.includes(email)) {
      quill.enable();
      setIsReadOnly(false);
    } else {
      quill.disable(); // Disable the editor if the user doesn't have write access
      setIsReadOnly(true);
    }
  }, [quill, initialData, email, author]);

  useEffect(() => {
    if (quill == null || documentId == null) return;
    const BASE_URL = process.env.REACT_APP_BASE_URL.slice(7);
    const socketa = new WebSocket(
      `ws://${BASE_URL}/documents/handler?document_id=${documentId}&token=${token}`
    );
    setSocket(socketa);

    return () => {
      socketa.close();
    };
  }, [quill, documentId, token]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.onopen = () => {
      console.log("connected");
      quill.enable();
      setIsOffline(false);
    };

    socket.onmessage = (e) => {
      quill.updateContents(JSON.parse(e.data));
    };

    socket.onerror = (e) => {
      console.log("Error from message");
      console.log(e.message);
    };

    socket.onclose = (e) => {
      console.log(e.code, e.reason);
      if (socket.readyState === WebSocket.CLOSED) {
        // disable the editor
        quill.disable();
        setIsOffline(true);
      }
    };

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      const message = {
        data: quill.getContents(),
        change: delta,
      };
      socket.send(JSON.stringify(message));
    });

    return () => {
      socket.close();
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    setQuill(q);
  }, []);

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} childern={<EditDocDetail />} />
      <EditorHeader isReadOnly={isReadOnly} />
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
}