'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useEffect, useState } from 'react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: 'blog-content-image' },
      }),
      Youtube.configure({
        width: 0,
        height: 0,
        HTMLAttributes: { class: 'blog-youtube-embed' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'blog-link' },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Comece a escrever seu artigo aqui...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || 'Imagem' }).run()
      setImageUrl('')
      setImageAlt('')
      setShowImageModal(false)
    }
  }, [editor, imageUrl, imageAlt])

  const addYoutube = useCallback(() => {
    if (youtubeUrl && editor) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
      setYoutubeUrl('')
      setShowYoutubeModal(false)
    }
  }, [editor, youtubeUrl])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL do link:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="border-2 border-sand-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-sand-200 bg-sand-50 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* Text Format Group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-sand-200 mr-2">
          <ToolBtn
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrito"
          >
            <span className="font-bold text-xs">B</span>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italico"
          >
            <span className="italic text-xs">I</span>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Sublinhado"
          >
            <span className="underline text-xs">U</span>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Riscado"
          >
            <span className="line-through text-xs">S</span>
          </ToolBtn>
        </div>

        {/* Heading Group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-sand-200 mr-2">
          <ToolBtn
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Titulo"
          >
            <span className="text-xs font-bold">H2</span>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Subtitulo"
          >
            <span className="text-xs font-bold">H3</span>
          </ToolBtn>
        </div>

        {/* List Group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-sand-200 mr-2">
          <ToolBtn
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Lista"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z" />
            </svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Lista numerada"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.242 5.992h12m-12 6.003h12m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 11 1.591 1.59l-1.83 1.83h2.16" />
            </svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Citacao"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </ToolBtn>
        </div>

        {/* Align Group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-sand-200 mr-2">
          <ToolBtn
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Alinhar esquerda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h12m-12 5.25h16.5" />
            </svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Centralizar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6 12h12M3.75 17.25h16.5" />
            </svg>
          </ToolBtn>
        </div>

        {/* Media Group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-sand-200 mr-2">
          <ToolBtn
            active={false}
            onClick={() => setLink()}
            title="Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.036a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.757 8.06" />
            </svg>
          </ToolBtn>
          <ToolBtn
            active={false}
            onClick={() => setShowImageModal(true)}
            title="Inserir imagem"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v13.5a1.5 1.5 0 001.5 1.5zm7.5-10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </ToolBtn>
          <ToolBtn
            active={false}
            onClick={() => setShowYoutubeModal(true)}
            title="Inserir video do YouTube"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </ToolBtn>
        </div>

        {/* Misc */}
        <div className="flex items-center gap-0.5">
          <ToolBtn
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Separador"
          >
            <span className="text-xs font-medium">―</span>
          </ToolBtn>
          <ToolBtn
            active={false}
            onClick={() => editor.chain().focus().undo().run()}
            title="Desfazer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </ToolBtn>
          <ToolBtn
            active={false}
            onClick={() => editor.chain().focus().redo().run()}
            title="Refazer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
          </ToolBtn>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal-900/60 backdrop-blur-sm p-4" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h4 className="text-lg font-bold text-charcoal-800 mb-4">Inserir Imagem</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 mb-1">URL DA IMAGEM</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 mb-1">LEGENDA (opcional)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={e => setImageAlt(e.target.value)}
                  placeholder="Descricao da imagem"
                  className="w-full px-4 py-2.5 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 text-sm"
                />
              </div>
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowImageModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 bg-sand-100 hover:bg-sand-200 transition-colors">
                Cancelar
              </button>
              <button
                onClick={addImage}
                disabled={!imageUrl}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #258389, #2E9EA6)' }}
              >
                Inserir Imagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal-900/60 backdrop-blur-sm p-4" onClick={() => setShowYoutubeModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h4 className="text-lg font-bold text-charcoal-800 mb-4">Inserir Video do YouTube</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 mb-1">URL DO VIDEO</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border-2 border-sand-200 rounded-xl bg-sand-50 text-charcoal-800 outline-none focus:border-olive-500 text-sm"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-charcoal-400">Cole o link completo do YouTube (ex: https://www.youtube.com/watch?v=abc123)</p>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowYoutubeModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 bg-sand-100 hover:bg-sand-200 transition-colors">
                Cancelar
              </button>
              <button
                onClick={addYoutube}
                disabled={!youtubeUrl}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #258389, #2E9EA6)' }}
              >
                Inserir Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Toolbar button component */
function ToolBtn({ active, onClick, title, children }: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
        active
          ? 'bg-olive-600 text-white shadow-sm'
          : 'text-charcoal-500 hover:bg-sand-200 hover:text-charcoal-700'
      }`}
    >
      {children}
    </button>
  )
}
