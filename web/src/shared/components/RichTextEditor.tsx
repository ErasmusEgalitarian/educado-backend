import React from "react";
import ReactQuill from "react-quill";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["image"], // Add the image button here
      ["link"],
      ["clean"], // Remove formatting button
    ],
  };

  const handleImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const range = (this as any).quill.getSelection();
          (this as any).quill.insertEmbed(range.index, "image", reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  return (
    <div>
      {/*}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange} // Call parent's onChange function
        modules={modules}
      />*/}
    </div>
  );
};

export default RichTextEditor;
