import axios from "axios";
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie';
import { TMessage } from "../interfaces/message";
import { Message } from "./Message";
import { TForum } from "../interfaces/forum";
import { TUser } from "../interfaces/user";
import { useNavigate, useParams } from "react-router-dom";
import { TbSettings } from 'react-icons/tb';
import { IoMdSend } from 'react-icons/io';
import Tooltip from '@mui/material/Tooltip';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

export const Forum = () => {

    const apiUri = 'http://localhost:3000';
    const { forumId, userId } = useParams();
    const [render, setRender] = useState<boolean>();
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [forum, setForum] = useState<TForum>();
    const [user, setUser] = useState<TUser>();
    const [content, setContent] = useState("");
    const [element, setElement] = useState("");
    const [isBold, setIsBold] = useState(false);

    let navigate = useNavigate();

    const diff: number[] = [];

    //////////////
    const [content1, setContent1] = useState<string>();


    const handleSubmit=()=>{
      console.log("Text was submitted: " + content1);
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
    ///////////////

    useEffect(() => {
        const token = Cookies.get('JwtToken');
        axios.get(`${apiUri}/message/${forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setMessages(res.data))
            .catch(error => console.log("get messages "+error))

        getForum()

    }, [render])

    useEffect(() => {
        if (forum)
            getUser()
        getDate()
    }, [forum])

    useEffect(() => {
        let temp2=element;
        for (let i = 0, j = 0; i < content.length || j < temp2.length; i++, j++) {
            if (element[j] == "<") {
                for (; element[j] != ">"; j++);
                i--;
                continue;
            }
            if (element[j] != content[i]) {       
                //add characters
                if (element[j] == content[i + 1]||element[j]==undefined) {
                    const temp = temp2;
                    temp2 = temp.substring(0, j) + content[i] + temp.substring(j, temp.length);
                    setElement(temp2);
                    // break;
                }
                //delete characters
                else if (element[j + 1] == content[i]|| content[i]==undefined) {
                    const temp = temp2;
                    temp2 = temp.substring(0, j) + temp.substring(j + 1, temp.length);
                    // if(j>0)
                        j--;
                    setElement(temp2);
                    // break;
                }

               else if(element[j] != undefined&& content[i]!=undefined){
                const temp = temp2;
                temp2 = temp.substring(0,j)+content[i]+temp.substring(j+1, temp.length);
                setElement(temp2);  
                }

            }
        }
    }, [content]);

    const getUser = async () => {
        await axios.get(`${apiUri}/user/${forum?.admin}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }

    const getForum = async () => {
        const token = Cookies.get('JwtToken');
        await axios.get(`${apiUri}/forum/${forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setForum(res.data))
            .catch(error => console.log(error))
    }

    function convertMsToTime(milliseconds: number) {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = minutes % 60;

        diff[0] = hours;
        diff[1] = minutes;

    }

    function diff_year_month_day(dt1: Date, dt2: Date) {

        const time = (dt2.getTime() - dt1.getTime()) / 1000;
        diff[0] = Math.abs(Math.round((time / (60 * 60 * 24)) / 365.25));
        diff[1] = Math.abs(Math.round(time / (60 * 60 * 24 * 7 * 4)));
        diff[2] = Math.abs(Math.round(time / (3600 * 24)));
    }

    const getDate = () => {
        if (forum?.lastEdited != null) {
            const date: Date = new Date(forum?.lastEdited);

            const tooday = new Date();

            if (date.getDate() == tooday.getDate() && date.getMonth() + 1 == tooday.getMonth() + 1 && date.getFullYear() == tooday.getFullYear()) {
                const msBetweenDates = tooday.getTime() - date.getTime();
                convertMsToTime(msBetweenDates);
                if (diff[0] != 0) {
                    return `נערך לאחרונה לפני ${diff[0]} שעות ו ${diff[1]} דקות`;
                }
                if (diff[1] != 0) {
                    return `נערך לאחרונה לפני ${diff[1]} דקות`;
                }
            }
            else {
                diff_year_month_day(tooday, date);
                if (diff[0] != 0) {
                    return `נערך לאחרונה לפני ${diff[0]} שנים`;
                }
                if (diff[1] != 0) {
                    return `נערך לאחרונה לפני ${diff[1]} חודשים`;
                }
                if (diff[2] != 0) {
                    return `נערך לאחרונה לפני ${diff[2]} ימים`;
                }
            }



        }

    }

    const addMessage = () => {
        let temp=element;
        if (isBold)
            temp=bold();
        const token = Cookies.get('JwtToken');
        const newMessage = {
            forumId: forumId,
            owner: 1,
            content: temp,
            date: Date.now(),
            deleted: false
        };
        try {
            axios.post(`${apiUri}/message`, newMessage, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setContent('');
            setElement('');
            updateDate();
        } catch {
            console.log((err: string)=>console.log("addMessage "+ err))
        }

    }

    const renderPage=()=>{
        setRender(!render);
    }

    const updateDate = () => {
        const token = Cookies.get('JwtToken');
        axios.put(`${apiUri}/forum/updateDate/${forumId}`,
            {
                forumId: forumId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        ).then(() => { setRender(!render) })
            .catch(error => console.log("updateDate "+error))
    }

    const bold = () => {
        let temp="";
        if (!isBold) {
            temp = element + "<strong>";
            setElement(temp);
            setIsBold(true);
        }
        else {
            temp = element + "</strong>";
            setElement(temp);
            setIsBold(false);
        }

        return temp;
    }

    const enter = () => {
        let temp="";
            temp = element + "<br/>";
            setElement(temp);

    }

    const showContent=()=>{
        let contentArr=[];
        contentArr.push(<p className="mb-1 text-break" dangerouslySetInnerHTML={{ __html: content }} ></p>)
        return contentArr;

    }

    if (forum)
        return (
            <>
                <div className="list-group">
                    <div className="list-group-item list-group-item-secondary center">
                        <div className="d-flex w-100 justify-content-between">
                            {
                                forum.isPublic ?
                                    (<p className="mb-1 titel">במה ציבורית</p>)
                                    :
                                    (<p className="mb-1 titel">לפורום זה הוזמנת באופן פרטי</p>)
                            }
                            <small>{getDate()}</small>
                        </div>
                        <h4 className="mb-1">{forum?.subject}</h4>
                        <small>{user?.name}</small>
                    </div>
                    <div className="scroll">
                        {messages.map((_message, i) => <Message key={i} renderPage={renderPage} message={_message} />)}
                    </div>
                    <div className="list-group-item list-group-item-secondary center">
                        <div className="d-flex w-100 justify-content-between">
                            <div>
                                {/* {isBold ?(
                                    <button className="clicked" onClick={bold}><FormatBoldIcon /></button>
                                ) :(
                                    <button onClick={bold}><FormatBoldIcon /></button>
                                )} */}
                                {/* <button onClick={enter}>enter</button> */}
                                <input type="text" name="content" value={content}  onChange={(event) => setContent(event.target.value)}></input>
                                {/* <input type="text" name="content" value={showContent()} onChange={(event) => setContent(event.target.value)} /> */}
                                <label onClick={addMessage}> < IoMdSend /></label>
                            </div>
<Editor
        apiKey="lyt9ncl78qxf9csxceuy0c3ih8ur163gy3f3xyxeaffb2vpq"
        // value={content}
        onInit={(evt, editor) => (editorRef.current = editor)}
        // initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          
          height: 200,
          menubar: false,
          directionality: "rtl",
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
            // "help",
            // "wordcount",
          ],
          toolbar:
            "undo redo  | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | " +
            "",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        // onEditorChange={(event) => handleChange(event)}
      /> 
       <button onClick={log}>Log editor content</button>

                            {userId == forum.admin ? (
                                <Tooltip title="ניהול המשתמשים בפורום, עריכת הגדרות וצפיה בנתונים">
                                    <button onClick={() => navigate(`/homePage/setForum/${forumId}/${userId}`)}>< TbSettings /></button>
                                </Tooltip>
                            ) : (<></>)}

                        </div>
                    </div>
                </div>
            </>
        )

}