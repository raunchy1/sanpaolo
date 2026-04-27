"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { useEffect } from "react";

/* ── Colour palette ── */
const COLORS = [
  { label: "Verde scuro",   value: "#072316" },
  { label: "Verde",         value: "#2E6B4A" },
  { label: "Verde chiaro",  value: "#4A9E74" },
  { label: "Oro",           value: "#C8A96B" },
  { label: "Rosso",         value: "#C0392B" },
  { label: "Blu",           value: "#1a6fbb" },
  { label: "Grigio scuro",  value: "#2d3436" },
  { label: "Grigio",        value: "#636e72" },
  { label: "Grigio chiaro", value: "#b2bec3" },
  { label: "Nero",          value: "#000000" },
  { label: "Bianco",        value: "#ffffff" },
];

/* ── Font list ── */
const FONTS = [
  { label: "Predefinito",        value: "" },
  { label: "Newsreader (serif)", value: "var(--font-newsreader), Georgia, serif" },
  { label: "Manrope (sans)",     value: "var(--font-manrope), system-ui, sans-serif" },
  { label: "Georgia",            value: "Georgia, serif" },
  { label: "Times New Roman",    value: "'Times New Roman', serif" },
  { label: "Garamond",           value: "Garamond, 'EB Garamond', serif" },
  { label: "Palatino",           value: "'Palatino Linotype', Palatino, serif" },
  { label: "Trebuchet MS",       value: "'Trebuchet MS', sans-serif" },
  { label: "Arial",              value: "Arial, Helvetica, sans-serif" },
  { label: "Verdana",            value: "Verdana, Geneva, sans-serif" },
  { label: "Courier New (mono)", value: "'Courier New', Courier, monospace" },
];

const HIGHLIGHT_COLORS = [
  "#ffeaa7", "#a8e6cf", "#74b9ff", "#fd79a8", "#fdcb6e",
];

/* ── Toolbar button ── */
function Btn({
  active, onClick, title, children,
}: {
  active?: boolean; onClick: () => void; title?: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-2 py-1.5 rounded text-xs font-medium transition-colors select-none ${
        active
          ? "bg-[#072316] text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/* ── Main component ── */
interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichEditor({ value, onChange, placeholder = "Scrivi qui…", minHeight = 120 }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" } }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none html-content",
        style: `min-height:${minHeight}px; padding: 12px 14px; font-size: 14px; line-height: 1.75; color: #2d3436;`,
      },
    },
  });

  /* Sync external value changes (e.g. load from API) */
  useEffect(() => {
    if (!editor) return;
    const cur = editor.getHTML();
    if (cur !== value && value !== undefined) {
      editor.commands.setContent(value || "", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#072316]/20 focus-within:border-[#072316] transition-all">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">

        {/* Text style */}
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Grassetto">
          <b>B</b>
        </Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Corsivo">
          <i>I</i>
        </Btn>
        <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Sottolineato">
          <u>U</u>
        </Btn>
        <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Barrato">
          <s>S</s>
        </Btn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Alignment */}
        <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Allinea sinistra">⬅</Btn>
        <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centra">≡</Btn>
        <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Allinea destra">➡</Btn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Lists */}
        <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista puntata">• Lista</Btn>
        <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerata">1. Lista</Btn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Font family */}
        <select
          title="Font"
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-600 focus:outline-none"
          onChange={(e) => {
            if (e.target.value === "") {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run();
            }
          }}
          defaultValue=""
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Font size */}
        <select
          title="Dimensione testo"
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-600 focus:outline-none"
          onChange={(e) => {
            if (e.target.value === "") {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(e.target.value).run();
            }
          }}
          defaultValue=""
        >
          <option value="">Dim.</option>
          <option value="11px">11</option>
          <option value="12px">12</option>
          <option value="13px">13</option>
          <option value="14px">14</option>
          <option value="15px">15</option>
          <option value="16px">16</option>
          <option value="17px">17</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="22px">22</option>
          <option value="24px">24</option>
          <option value="28px">28</option>
          <option value="32px">32</option>
          <option value="36px">36</option>
          <option value="42px">42</option>
          <option value="48px">48</option>
        </select>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Text color */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 select-none">Colore:</span>
          <div className="flex gap-0.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setColor(c.value).run();
                }}
                className="w-5 h-5 rounded-sm border border-gray-300 hover:scale-110 transition-transform"
                style={{ background: c.value }}
              />
            ))}
            <button
              type="button"
              title="Colore personalizzato"
              className="w-5 h-5 rounded-sm border border-gray-300 overflow-hidden hover:scale-110 transition-transform"
              onMouseDown={(e) => e.preventDefault()}
            >
              <input
                type="color"
                className="w-6 h-6 -translate-x-0.5 -translate-y-0.5 cursor-pointer"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                title="Colore personalizzato"
              />
            </button>
            <button
              type="button"
              title="Rimuovi colore"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetColor().run();
              }}
              className="w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center text-[9px] text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Highlight */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 select-none">Evidenzia:</span>
          <div className="flex gap-0.5">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHighlight({ color: c }).run();
                }}
                className="w-5 h-5 rounded-sm border border-gray-300 hover:scale-110 transition-transform"
                style={{ background: c }}
              />
            ))}
            <button
              type="button"
              title="Rimuovi evidenziatura"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetHighlight().run();
              }}
              className="w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center text-[9px] text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Annulla">↩</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Ripeti">↪</Btn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Link */}
        <Btn
          active={editor.isActive("link")}
          title="Inserisci link"
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              const url = window.prompt("URL del link:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          🔗
        </Btn>
      </div>

      {/* ── Editor area ── */}
      <div className="bg-white">
        {!editor.getText() && !editor.isActive("paragraph") && (
          <div className="absolute pointer-events-none px-4 py-3 text-gray-300 text-sm select-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
