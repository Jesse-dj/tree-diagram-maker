import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { yaml, yamlFrontmatter, yamlLanguage } from '@codemirror/lang-yaml'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import { crosshairCursor, drawSelection, dropCursor, EditorView, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection  } from '@codemirror/view'
import { createFolderTree } from './parser'
import { showToast } from './toast'
import debounce from 'lodash.debounce'

const initialDoc = localStorage.getItem("tree-diagram") ?? `src:
  components:
    atoms:
    molecules:
    organisms:
  features:
    events:
      components:
        - EventForm.tsx
  pages:
  utils:`
const targetElement = document.querySelector('#editor')!

const updateOutputExtension = EditorView.updateListener.of((update) => {
    const html = createFolderTree(update.state.doc);
    console.log(yamlLanguage.parser.parse(update.state.doc.toString()))
    document.querySelector('#output')!.innerHTML = html;
});

const saveLocalStorageExtension = EditorView.updateListener.of((update) => {
  if (update.docChanged){
    debounce(() => {
      localStorage.setItem("tree-diagram", update.state.doc.toString());

      showToast({
          message: "Toasting up!",
          variant: "success" // "danger" | "warning" | "info"
      });
    }, 800);
  }
});

new EditorView({
  parent: targetElement,
  state: EditorState.create({
    doc: initialDoc,
    extensions: [
      autocompletion(),
      bracketMatching(),
      closeBrackets(),
      crosshairCursor(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      highlightSpecialChars(),
      history(),
      indentOnInput(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab
      ]),
      lineNumbers(),
      rectangularSelection(),
      updateOutputExtension,
      saveLocalStorageExtension,
      yaml(),
      yamlFrontmatter( { content: yaml() } ),
    ]
  })
})

