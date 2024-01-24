import { useEffect, useState } from "react"
import { TMessage } from "../interfaces/message"
import { TUser } from "../interfaces/user";
import axios from "axios";
import { AiFillDelete } from 'react-icons/ai';
import Cookies from 'js-cookie';;
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { TForum } from "../interfaces/forum";

interface props{
    renderPage:()=>void;
    message: TMessage;
}

export const Message = ({renderPage, message}:props) => {

    const apiUri = 'http://localhost:3000';
    const [user, setUser] = useState<TUser>();
    const [Sdate, setSDtae] = useState("");
    const [currentUser, setCurrentUser] = useState<TUser>();
    const [currentForum, setCurrentForum] = useState<TForum>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = Cookies.get('JwtToken');
        axios.get(`${apiUri}/user/${message.owner}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err))

        axios.get(`${apiUri}/user/getCurrentUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(res => setCurrentUser(res.data))
            .catch(err => console.log(err))



        axios.get(`${apiUri}/forum/${message.forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setCurrentForum(res.data))
            .catch(error => console.log(error))

        getDate();
    }, [])

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    function padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    const 
    getDate = () => {
        const d: Date = new Date(message.date);
        const tooday = new Date();
        const day = d.getDate()
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const hours = padTo2Digits(d.getHours());
        const minutes = padTo2Digits(d.getMinutes());

        if (day == tooday.getDate() && month == tooday.getMonth() + 1 && year == tooday.getFullYear())
            setSDtae(`${minutes} : ${hours}`);
        else
            setSDtae(`${day}/${month}/${year}`);
    }

    const deleteMessage = () => {
        const token = Cookies.get('JwtToken');
        axios.post(`${apiUri}/message/${message._id}`,
            {
                id: message._id
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(() => { handleClick(); updateDate(); })
            .catch(err => console.log(err))
            renderPage();
    }

    const updateDate = () => {
        const token = Cookies.get('JwtToken');
        axios.put(`${apiUri}/forum/updateDate/${message.forumId}`,
            {
                forumId: message.forumId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        ).then(() => { })
            .catch(error => console.log(error))
    }

    const showContent=()=>{
        let contentArr=[];
        contentArr.push(message.content);
        return contentArr;
    }

    return (<>
        {message.deleted ? (
            <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1"></p>
                    <small>{Sdate}</small>
                </div>
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1">ההודעה נמחקה</p>
                </div>

            </div>
        ) : (
            <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1"><strong>{user?.name}</strong></p>
                    <small>{Sdate}</small>
                </div>
                <div className="d-flex w-100 justify-content-between">
                    {/* <p className="mb-1 text-break">{showContent()}</p> */}
                    <p className="mb-1 text-break" dangerouslySetInnerHTML={{ __html: message.content }} ></p>
                    {currentUser?._id==message.owner|| currentUser?._id==currentForum?.admin?(
                    //  <button onClick={deleteMessage}><AiFillDelete /></button>
                    <IconButton onClick={deleteMessage} aria-label="delete" size="small">
                   <AiFillDelete />
                </IconButton>
                   ):(
                    <></>
                   )}
                </div>
            </div>
        )}
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="ההודעה נמחקה בהצלחה"
            action={action}
        />
    </>
    )
}