import { mailQueue } from "./utils/queueManager";
import MailUtil from "./utils/mail";
class Workers {
  public async startAll(): Promise<void> {
    await mailQueue.startWorker(MailUtil.sendMail.bind(MailUtil));
  }
}

export default new Workers();
