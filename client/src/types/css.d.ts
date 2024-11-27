declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-quill/dist/quill.snow.css';
