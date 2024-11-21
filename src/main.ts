import './assets/style/main.css'
import './editor.ts'
import * as htmlToImage from 'html-to-image';
import download from "downloadjs";

const copyButton = document.getElementById('copy-btn')!;
copyButton.addEventListener('click', () => {
  const node = document.getElementById('output')!;

  navigator.clipboard.writeText(node.innerHTML);
});

const exportButton = document.getElementById('export-png')!;
exportButton.addEventListener('click', () => {
  const node = document.getElementById('output')!;

  htmlToImage.toPng(node)
  .then(function (dataUrl) {
    download(dataUrl, 'my-files.png');
  });
});