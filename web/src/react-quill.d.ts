// src/react-quill.d.ts
declare module "react-quill" {
  import { Component } from "react";

  export interface ReactQuillProps {
    value: string;
    onChange: (
      content: string,
      delta: any,
      source: string,
      editor: any,
    ) => void;
    theme?: string;
    modules?: any;
    formats?: string[];
  }

  export default class ReactQuill extends Component<ReactQuillProps> {}
}
