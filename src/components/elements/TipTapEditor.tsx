"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TiptapEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "text-base leading-relaxed list-disc list-inside pl-4 min-h-[160px] p-4 bg-base-100 rounded-b-lg border-2 border-t-0 border-base-300",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="relative w-full rounded-xl">
      {editor && (
        <>
          {/* Static Toolbar */}
          <div className="bg-base-100 border-2 border-base-300 rounded-t-lg p-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleBold().run();
              }}
              className={`btn btn-sm ${
                editor.isActive("bold") ? "btn-primary btn-soft" : ""
              }`}
            >
              Bold
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleItalic().run();
              }}
              className={`btn btn-sm ${
                editor.isActive("italic") ? "btn-primary btn-soft" : ""
              }`}
            >
              Italic
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleStrike().run();
              }}
              className={`btn btn-sm ${
                editor.isActive("strike") ? "btn-primary btn-soft" : ""
              }`}
            >
              Strike
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }}
              className={`btn btn-sm ${
                editor.isActive("heading", { level: 3 })
                  ? "btn-primary btn-soft"
                  : ""
              }`}
            >
              H3
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleHeading({ level: 4 }).run();
              }}
              className={`btn btn-sm ${
                editor.isActive("heading", { level: 4 })
                  ? "btn-primary btn-soft"
                  : ""
              }`}
            >
              H4
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleBulletList().run();
              }}
              className={`btn btn-sm ${
                editor.isActive("bulletList") ? "btn-primary btn-soft" : ""
              }`}
            >
              • List
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().clearNodes().unsetAllMarks().run();
              }}
              className="btn btn-sm"
            >
              Clear
            </button>
          </div>
        </>
      )}

      <EditorContent editor={editor} className="tiptap-list-style btn-soft" />
    </div>
  );
};

export default TiptapEditor;
