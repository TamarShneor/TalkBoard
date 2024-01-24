import './App.css'
import { Login } from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

//TODO install this:
// import ReactHtmlParser from "react-html-parser";

function App() {

  const [content, setContent] = useState<string>();


  const handleSubmit=()=>{
    console.log("Text was submitted: " + content);
    // event.preventDefault();
  }

  const handleChange=(event: string)=>{
    setContent(event);
  }

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
    // console.log(content)
  };


  return (
<>
<Login/>
       {/* <Login /> */}
       {/* <form onSubmit={handleSubmit}>
        <h2>Introduction to Software Engineering</h2>
        <h3>Provide a course overview</h3>
        <Editor
          apiKey="lyt9ncl78qxf9csxceuy0c3ih8ur163gy3f3xyxeaffb2vpq"
          value={content}
          init={{
            height: 200,
            menubar: false
          }}
          onEditorChange={(event) => handleChange(event)}
        />
        <br />
        <input type="submit" value="Submit" />
      </form> */}
       {/* <Outlet /> */}

      {/* <Editor
        apiKey="lyt9ncl78qxf9csxceuy0c3ih8ur163gy3f3xyxeaffb2vpq"
        // value={content}
        onInit={(evt, editor) => (editorRef.current = editor)}
        // initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          // directionality : "rtl",
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        // onEditorChange={(event) => handleChange(event)}
      />
      <button onClick={log}>Log editor content</button> */}
    </>

  )
}

export default App