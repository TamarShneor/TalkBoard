import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Forum } from 'src/schemas/forum.schema';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly userService: UserService) { }

  public async sendMail(forum: Forum, auth: string) {
    const currentUser = this.userService.getCurrentUser(auth);
    console.log(forum.usersList);
    let admin: User;
    try {
      for (let i = 0; i < forum.usersList.length; i++) {
        const user = this.userService.getUserByEmail(forum.usersList[i]);
        let name = "";

        if (await user) {
          name = (await user).name;
          if ((await user)._id == forum.admin) {
            admin = await user;
            console.log(admin);

          }

        }
        else
          name = forum.usersList[i];
        this.mailerService
          .sendMail({
            to: forum.usersList[i],
            from: 'talkboard999@gmail.com',
            subject: 'צורפת לפורום ' + forum.subject,
            text: 'talkboard', 
            html: `<h2 style="text-align: center;"><strong>הי </strong><strong>${name}</strong><strong>,</strong></h2><p style="text-align: center;">הצטרפת בהצלחה לפורום <strong>${forum.subject}</strong> ע"י <strong>${(await currentUser).name}</strong> בפלטפורמת TalkBoard.</p><p style="text-align: center;">נשמח לראותך משתמש &nbsp;פעיל בפורום.</p><p style="text-align: center;">את/ה מוזמן/ת להצטרף לקהילת המשתמשים,</p><p style="text-align: center;">שלנו ולהנות ממגוון השירותים ש TalkBoard מעמיד לרשותך.</p><p style="text-align: center;">&nbsp;</p><p style="text-align: center;">לינק לאתר: <a href="http://127.0.0.1:5173/">TalkBoard</a></p>
            <img style="width:250px;" src="cid:logo">`,
            attachments: [{
              filename: 'Logo.png',
              path:'crc/logo.png',
              cid: 'logo' 
         }]
          })
          .then()
          .catch((err) => {
            console.log(err);
          });
      }
      this.sendMailManager(admin, forum)
    }
    catch { }
  }

  //לזמן את הפונקציה מהפונקציה למעלה 
  sendMailManager = (user: User, forum: Forum) => {
    this.mailerService
      .sendMail({
        to: user.email,  // list of receivers
        from: 'talkboard999@gmail.com', // sender address
        subject: `יצירת הפורום ${forum.subject} הסתימה בהצלחה`, // Subject line
        // text: 'האם רואים את זה?', // plaintext body
        html: `
          <h2 style="text-align: center;"><strong>הי </strong><strong>${user.name}</strong><strong>,</strong></h2>
          <p style="text-align: center;">הפורום B נוצר בהצלחה ונשלחו הזמנות לכל משתתפי הפורום.</p>
          <p style="text-align: center;">אנו מודים לך שבחרת להצטרף לרשימת הלקוחות המרוצים שלנו,</p>
          <p style="text-align: center;">מקווים שנהנית, נשמח להמשיך לעמוד לשירותך!</p>
          <p style="text-align: center;">&nbsp;אנחנו פה לכל הערה והארה- <a href="mailto:talkBoard434@gmail.com">talkBoard434@gmail.com</a></p>
          <p style="text-align: center;">לינק לאתר: <a href="http://127.0.0.1:5173/">TalkBoard</a></p>
          <img style="width:250px;" src="cid:logo">`,
          attachments: [{
            filename: 'Logo.png',
            path:'crc/logo.png',
            cid: 'logo' 
       }]
      })
      .then(() => { console.log("mail sended to the manager") })
      .catch((err) => {
        console.log(err);
      });
  }

  sendMailPassword = (user: User) => {
    this.mailerService
      .sendMail({
        to: user.email,  // list of receivers
        from: 'talkboard999@gmail.com', // sender address
        subject: `עדכון סיסמה`, // Subject line
        // text: 'האם רואים את זה?', // plaintext body
        html: `
          <p style="text-align: center;">סיסמתך החדשה היא:</p>
          <p style="text-align: center;">${user.password}</p>
          <img style="width:250px;" src="cid:logo">`,
          attachments: [{
            filename: 'Logo.png',
            path:'crc/logo.png',
            cid: 'logo' 
       }]
      })
      .then(() => { console.log("mail sended to the manager") })
      .catch((err) => {
        console.log(err);
      });
  }
}
